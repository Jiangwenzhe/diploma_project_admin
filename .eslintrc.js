/*
 * @Author: Wenzhe
 * @Date: 2020-04-08 16:25:20
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-09 18:49:27
 */
module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  plugins: ["react-hooks"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
};
