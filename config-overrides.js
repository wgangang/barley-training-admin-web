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
        target: 'http://10.10.2.90',
        changeOrigin: true,
        secure: false,
        // pathRewrite: { '^/api/report': '' },
        headers: {
          uid: '1',
          authorization: 'Bearer SYSTEM.784313ebd6f1491094f4ea26a65c9c94.670a0ddf'
        }
      },
      '/api/usercenter/': {
        target: 'http://10.10.2.90',
        changeOrigin: true,
        secure: false,
        headers: {
          Authorization: 'Bearer SYSTEM.784313ebd6f1491094f4ea26a65c9c94.670a0ddf'
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
