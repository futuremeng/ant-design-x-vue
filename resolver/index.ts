/*
 * @Author: Future Meng futuremeng@gmail.com
 * @Date: 2025-09-03 15:50:05
 * @LastEditors: Future Meng futuremeng@gmail.com
 * @LastEditTime: 2025-09-04 09:38:49
 * @FilePath: /ant-design-x-vue/resolver/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export interface AntDesignXResolverOptions {
  /**
   * exclude components that do not require automatic import
   *
   * @default []
   */
  exclude?: string[]

  /**
   * rename package
   *
   * @default '@futuremeng/ant-design-x-vue'
   */
  packageName?: string

  /**
   * customizable prefix for resolving components
   * 
   * @default 'AX'
   */
  prefix?: string
}

/**
 * set of components that are contained in the package
 */
const primitiveNames = new Set<string>([
  'Attachments',
  'Bubble',
  'Conversations',
  'Prompts',
  'Sender',
  'Suggestion',
  'Theme',
  'ThoughtChain',
  'Welcome',
])

function isAntdXVueComponent(name: string) {
  return primitiveNames.has(name)
}

// currently unnecessary to add side effects
// function getSideEffects(
//  componentName: string,
//  options: AntDesignXResolverOptions = {} 
// ) {
//   const { importStyle = true, packageName = '@futuremeng/ant-design-x-vue' } = options

//   if (!importStyle) return

//   return 
// }

export function AntDesignXVueResolver(
  options: AntDesignXResolverOptions = {}
) {
  const {
    prefix = 'AX',
    packageName = '@futuremeng/ant-design-x-vue',
    exclude = []
  } = options

  const resolverInfo = {
    type: 'component',
    resolve: (name: string) => {
      if (!name.startsWith(prefix)) return

      const componentName = name.slice(prefix.length)

      if (
        !isAntdXVueComponent(componentName) || exclude.includes(componentName)
      ) return

      return {
        name: componentName,
        from: packageName,
        as: `${prefix}${componentName}`
      }
    }
  }
  return resolverInfo.resolve
}
