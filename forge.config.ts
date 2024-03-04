import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';
import 'dotenv/config'
import MakerDMG from '@electron-forge/maker-dmg';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    extraResource:['./app/']
  },
  rebuildConfig: {},
  makers: [new MakerZIP({}), new MakerDMG({
    name:'Coletor_de_Dados_Financeiros'
  })],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        authToken:GITHUB_TOKEN,
        repository: {
          owner: 'Pedro Dutra',
          name: 'coletor-dados-financeiros'
        },
        prerelease: true
      }
    },

  ],
  plugins: [
    
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      devContentSecurityPolicy:"connect-src 'self' http://localhost:8000 'unsafe-eval'",
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
  ],
};

export default config;
