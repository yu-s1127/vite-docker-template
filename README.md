# 導入手順

~Docker のインストールなどの手順は省きます~

## 1. Vite でプロジェクトを作成

`docker-compose build`<br>
`docker-compose run node npm create vite@latest`

- vite のバージョンは任意で変更してください
- プロジェクト名を変更する場合は Dockerfile の WORKDIR と docker-compose.yaml の command を適宜修正してください

## 2. vite.config.ts(or js)を編集

- plugins 移行に server に関する設定を追加
- host は true にし、port は 3000 で起動するようにする

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
  }
})
```

## 3. npm install を実行

`docker-compose run node npm --prefix ./app install`

- 1 と同様にプロジェクト名を別名称に帰る場合は ./app の部分をその名称に変更してください

## 4. 起動

`docker-compose up` or `docker-compose up -d`

### 注意事項

- node18 移行の image 以外だと失敗した(原因不明)
