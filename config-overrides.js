/* eslint-disable */
// config-overrides.js
const {
  override,
  overrideDevServer,
  addLessLoader,
  adjustStyleLoaders
} = require('customize-cra');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const { name } = require('./package');

const devServerConfig = () => config => {
  return {
    ...config,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api': '' },
        headers: {
          uid: '1',
          // authorization: 'Bearer SYSTEM.b18830c77af24b5faf0e3bc29297e7dd.67147366'
        }
      },
      '/api/auth/getSliderImageCode': {
        target: 'https://data.liexiong.net',
        changeOrigin: true,
        secure: false,
        headers: {
          uid: '1',
          // authorization: 'Bearer 9c67b878a74848898be92725879e0a84'
        }
      }
    }
  };
};

module.exports = {
  devServer: overrideDevServer(devServerConfig()),
  webpack: override(
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
        modifyVars: {
          //"@primary-color": "#13c2c2"
        }
      }
    }),
    adjustStyleLoaders(({ use: [, , postcss] }) => {
      const postcssOptions = postcss.options;
      postcss.options = { postcssOptions };
    }),
    (config) => {

      // 环境变量
      let env;
      if (config.mode === 'production') {
        env = dotenv.config({ path: path.resolve(__dirname, '.env.' + config.mode) }).parsed;
      } else {
        env = dotenv.config().parsed;
      }
      const envKeys = Object.keys(env)
        .reduce((prev, next) => {
          prev[`process.env.${next}`] = JSON.stringify(env[next]);
          return prev;
        }, {});

      // 静态资源路径
      const publicPath = JSON.parse(envKeys['process.env.STATIC_BASE'] || '"/"');
      config.output.publicPath = publicPath.endsWith('/') ? publicPath : publicPath + '/';

      // 微服务
      config.output.library = `${name}-[name]`;
      config.output.libraryTarget = 'umd';
      config.output.chunkLoadingGlobal = `webpackJsonp_${name}`;
      config.output.globalObject = 'window';

      // 设置
      config.resolve.alias['@'] = path.resolve(__dirname, 'src');
      config.resolve.alias['@assets'] = path.resolve(__dirname, 'src/assets');
      config.resolve.alias['@components'] = path.resolve(__dirname, 'src/components');
      config.resolve.alias['@apis'] = path.resolve(__dirname, 'src/apis');
      config.resolve.alias['@pages'] = path.resolve(__dirname, 'src/pages');

      // 环境变量
      config.plugins.push(new webpack.DefinePlugin(envKeys));

      return config;
    }
  )
};
