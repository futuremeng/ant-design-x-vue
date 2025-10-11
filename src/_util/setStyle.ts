import type { CSSProperties } from 'vue';

/**
 * Easy to set element style, return previous style
 * IE browser compatible(IE browser doesn't merge overflow style, need to set it separately)
 * https://github.com/ant-design/ant-design/issues/19393
 *
 */
export interface SetStyleOptions {
  element?: HTMLElement;
}

function setStyle(style: CSSProperties, options: SetStyleOptions = {}): CSSProperties {
  const { element = document.body } = options;
  const oldStyle: CSSProperties = {};

  const styleKeys = Object.keys(style);

  // IE browser compatible
  styleKeys.forEach(key => {
    const cssKey = key as keyof CSSProperties;
    // 将驼峰命名转换为短横线命名
    const kebabKey = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
    oldStyle[cssKey] = element.style.getPropertyValue(kebabKey) as any;
  });

  styleKeys.forEach(key => {
    const cssKey = key as keyof CSSProperties;
    const kebabKey = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
    element.style.setProperty(kebabKey, (style[cssKey] as string | null) ?? '');
  });

  return oldStyle;
}

export default setStyle;