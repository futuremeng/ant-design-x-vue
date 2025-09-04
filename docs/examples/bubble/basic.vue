<script setup lang="tsx">
import { Bubble } from '@futuremeng/ant-design-x-vue';

defineOptions({ name: 'AXBubbleBasic' });

defineRender(() => {
  return (
    <Bubble content="hello world !" />
  )
})
</script>
