/*
 * @Author: Future Meng futuremeng@gmail.com
 * @Date: 2025-09-03 15:50:05
 * @LastEditors: Future Meng futuremeng@gmail.com
 * @LastEditTime: 2025-10-11 20:08:28
 * @FilePath: /ant-design-x-vue/.eslintrc.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
  extends: ['plugin:vue/vue3-recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'vue/one-component-per-file': 'off',
    'vue/multi-word-component-names': 'off'
  },
};
