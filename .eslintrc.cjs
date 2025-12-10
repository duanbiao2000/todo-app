/**
 * 🎓 ESLint 配置文件
 * ============================================
 * 
 * 解决方案: 添加 .eslintignore 文件忽略生成的文件
 * 同时移除对 @babel/eslint-parser 的依赖
 */
module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2022: true
    },
    // 🎓 使用字符串数组声明插件
    plugins: ['vue'],
    // 🎓 使用基础规则集
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    // 🎓 手动配置 Vue 相关规则
    rules: {
        // Vue 基础规则
        'vue/multi-word-component-names': 'off',
        'vue/no-unused-vars': 'warn',

        // JavaScript 规则
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-unused-vars': 'warn',
        'no-undef': 'warn'
    },
    // 🎓 Vue 文件需要特殊的 parser
    overrides: [
        {
            files: ['*.vue'],
            parser: 'vue-eslint-parser',
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            }
        }
    ]
}
