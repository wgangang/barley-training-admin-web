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
      '/api/report': {
        target: 'http://10.10.2.90',
        changeOrigin: true,
        secure: false,
        // pathRewrite: { '^/api/report': '' },
        headers: {
          uid: '1',
          authorization: 'Bearer SYSTEM.f405911fff5c40a5a87453df11d8e7cb.66f8c1ea'
        }
      },
      '/api/training': {
        target: 'https://10.10.2.90',
        // target: 'http://10.10.1.45:8080',
        changeOrigin: true,
        secure: false,
        // pathRewrite: { '^/api/supply-chain': '' },
        headers: {
          uid: '1',
          authorization: 'Bearer SYSTEM.f405911fff5c40a5a87453df11d8e7cb.66f8c1ea'
        }
      },
      '/api/usercenter/': {
        target: 'http://10.10.2.90',
        changeOrigin: true,
        secure: false,
        headers: {
          Authorization: 'Bearer SYSTEM.f405911fff5c40a5a87453df11d8e7cb.66f8c1ea'
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
