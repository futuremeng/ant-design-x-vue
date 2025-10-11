import type { MotionEvent, CSSMotionProps, MotionEndEventHandler, MotionEventHandler } from './transition';
import { defaultPrefixCls } from '../x-provider';

// ================== Collapse Motion ==================
const getCollapsedHeight: MotionEventHandler = () => ({ height: 0, opacity: 0 });
const getRealHeight: MotionEventHandler = (node) => {
  const { scrollHeight } = node;
  return { height: scrollHeight, opacity: 1 };
};
const getCurrentHeight: MotionEventHandler = (node) => ({ height: node ? (node as HTMLElement).offsetHeight : 0 });
const skipOpacityTransition: MotionEndEventHandler = (_, event: MotionEvent) =>
  event?.deadline === true || (event as TransitionEvent).propertyName === 'height';

const initCollapseMotion = (rootCls = defaultPrefixCls): CSSMotionProps => ({
  name: `${rootCls}-motion-collapse`,
  onBeforeEnter: getCollapsedHeight,
  onEnter: getCollapsedHeight,
  onBeforeAppear: getRealHeight,
  onAfterEnter: getRealHeight,
  onBeforeLeave: getCurrentHeight,
  onLeave: getCollapsedHeight,
  onAfterAppear: skipOpacityTransition,
  onAfterLeave: skipOpacityTransition,
});

export default initCollapseMotion;
