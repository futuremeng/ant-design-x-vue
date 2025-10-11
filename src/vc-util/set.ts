import get from './get';

function internalSet<Entity = any, Output = Entity, Value = any>(
  entity: Entity,
  paths: (string | number)[],
  value: Value,
  removeIfUndefined: boolean,
): Output {
  if (!paths.length) {
    return value as unknown as Output;
  }

  const [path, ...restPath] = paths;

  let clone: Output;
  if (!entity && typeof path === 'number') {
    clone = [] as unknown as Output;
  } else if (Array.isArray(entity)) {
    clone = [...entity] as unknown as Output;
  } else {
    clone = { ...entity } as unknown as Output;
  }

  // 修复：增强类型安全，确保 clone 是可索引的
  if (removeIfUndefined && value === undefined && restPath.length === 1) {
    const cloneObj = clone as Record<string | number, any>;
    if (cloneObj[path] !== undefined) {
      delete cloneObj[path][restPath[0]];
    }
  } else {
    const cloneObj = clone as Record<string | number, any>;
    cloneObj[path] = internalSet(cloneObj[path], restPath, value, removeIfUndefined);
  }

  return clone;
}

export default function set<Entity = any, Output = Entity, Value = any>(
  entity: Entity,
  paths: (string | number)[],
  value: Value,
  removeIfUndefined = false,
): Output {
  if (
    paths.length &&
    removeIfUndefined &&
    value === undefined &&
    !get(entity, paths.slice(0, -1))
  ) {
    return entity as unknown as Output;
  }

  return internalSet(entity, paths, value, removeIfUndefined);
}