const baseUrl =
  process.env.VERCEL_ENV === 'production'
    ? `https://${process.env.VERCEL_URL}`
    : process.env.VERCEL_ENV === 'preview'
    ? `https://pickems-app-git-working-3-brett-ranieri.vercel.app/`
    : 'http://localhost:3000'

export default baseUrl


// https://vercel.com/docs/projects/environment-variables/system-environment-variables