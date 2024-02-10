const baseUrl =
  process.env.VERCEL_ENV === 'production'
    ? `https://pickems-app.vercel.app`
    : 'http://localhost:3000'

export default baseUrl


// https://vercel.com/docs/projects/environment-variables/system-environment-variables