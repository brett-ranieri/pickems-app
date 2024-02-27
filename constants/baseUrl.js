const baseUrl =
  process.env.VERCEL_ENV === 'production'
    ? `https://${process.env.VERCEL_URL}`
    : process.env.VERCEL_ENV === 'preview'
    ? `https://pickems-app-git-refactor-branch-brett-ranieri.vercel.app`
    : 'http://localhost:3000'
// 1st 
// delete your fucking logs that are everywhere and also all my old comments that are useless. clean up a little and commit. 
// then...
// set this up so yo udont have to manually switch the urls
// replace the production variable with your hard coded vercel production url
// then go all through the code and make everything baseurl. and commit. and test on vercel. 
export default baseUrl


// https://vercel.com/docs/projects/environment-variables/system-environment-variables