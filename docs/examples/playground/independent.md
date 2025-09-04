# ts

``` vue
<template>
  <div :style="styles.layout">
    <div :style="styles.sider">
      <!-- Logo -->
      <div :style="styles.logo">
        <img
          src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
          draggable="false"
          alt="logo"
          width="24"
          height="24"
        />
        <span :style="styles.logoTitle">Ant Design X</span>
      </div>

      <!-- Add Conversation Button -->
      <Button
        @click="handleNewConversation"
        type="link"
        :style="styles.addBtn"
        :icon="plusIcon()"
      >
        New Conversation
      </Button>

      <!-- Conversations List -->
      <Conversations
        :items="conversations"
        :style="styles.conversations"
        :activeKey="curConversation"
        @activeChange="handleActiveChange"
        groupable
        :styles="{ item: { padding: '0 8px' } }"
        :menu="conversationMenu"
      />

      <div :style="styles.siderFooter">
        <Avatar :size="24" />
        <Button type="text" :icon="questionCircleOutlinedIcon()" />
      </div>
    </div>

    <div :style="styles.chat">
      <div :style="styles.chatList">
        <template v-if="messages.length">
          Messages List
          <Bubble.List
            :items="bubbleItems"
            :style="{ height: '100%', paddingInline: 'calc(calc(100% - 700px) /2)' }"
            :roles="bubbleRoles"
          />
        </template>
        <template v-else>
          <Space
            direction="vertical"
            :size="16"
            :style="{ paddingInline: 'calc(calc(100% - 700px) /2)', ...styles.placeholder }"
          >
            <Welcome
              variant="borderless"
              icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
              title="Hello, I'm Ant Design X Vue"
              description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
            >
              <template #extra>
                <Space>
                  <Button :icon="h(ShareAltOutlined)" />
                  <Button :icon="h(EllipsisOutlined)" />
                </Space>
              </template>
            </Welcome>
            
            <Flex :gap="16">
              <Prompts
                :items="[HOT_TOPICS]"
                :styles="promptsStyles"
                @itemClick="handleTopicClick"
              />
              
              <Prompts
                :items="[DESIGN_GUIDE]"
                :styles="guideStyles"
                @itemClick="handleGuideClick"
              />
            </Flex>
          </Space>
        </template>
      </div>
      
      <!-- Prompts and Sender -->
      <Prompts
        :items="SENDER_PROMPTS"
        @itemClick="handleSenderPromptClick"
        :styles="{ item: { padding: '6px 12px' } }"
        :style="styles.senderPrompt"
      />
      
      <Sender
        v-model:value="inputValue"
        :header="senderHeader"
        @submit="handleSubmit"
        @cancel="handleCancel"
        :prefix="senderPrefix"
        :loading="loading"
        :style="styles.sender"
        allowSpeech
        :actions="senderActions"
        placeholder="Ask or input / use skills"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Define icon as a function returning the VNode
const plusIcon = () => h(PlusOutlined);

const questionCircleOutlinedIcon=()=> h(QuestionCircleOutlined);

import {
  Attachments,
  type AttachmentsProps,
  Bubble,
  Conversations,
  Prompts,
  type PromptsProps,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
} from '@futuremeng/ant-design-x-vue';

import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  CloudUploadOutlined,
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  DislikeOutlined,
  EditOutlined,
  EllipsisOutlined,
  FileSearchOutlined,
  HeartOutlined,
  LikeOutlined,
  PaperClipOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  ScheduleOutlined,
  ShareAltOutlined,
  SmileOutlined,
} from '@ant-design/icons-vue';

import { Avatar, Button, Flex, message, Space, Spin, theme } from 'ant-design-vue';



import { computed, ref, watch, h } from 'vue';
import dayjs from 'dayjs';


type BubbleDataType = {
  role: string;
  content: string;
};

defineOptions({ 
  name: 'PlaygroundIndependent' 
});

// Constants
const DEFAULT_CONVERSATIONS_ITEMS = [
  {
    key: 'default-0',
    label: 'What is Ant Design X Vue?',
    group: 'Today',
  },
  {
    key: 'default-1',
    label: 'How to quickly install and import components?',
    group: 'Today',
  },
  {
    key: 'default-2',
    label: 'New AGI Hybrid Interface',
    group: 'Yesterday',
  },
];

const HOT_TOPICS = {
  key: '1',
  label: 'Hot Topics',
  children: [
    {
      key: '1-1',
      description: 'What has Ant Design X Vue upgraded?',
      icon: h('span', { style: { color: '#f93a4a', fontWeight: 700 } }, '1'),
    },
    {
      key: '1-2',
      description: 'New AGI Hybrid Interface',
      icon: h('span', { style: { color: '#ff6565', fontWeight: 700 } }, '2'),
    },
    {
      key: '1-3',
      description: 'What components are in Ant Design X Vue?',
      icon: h('span', { style: { color: '#ff8f1f', fontWeight: 700 } }, '3'),
    },
    {
      key: '1-4',
      description: 'Come and discover the new design paradigm of the AI era.',
      icon: h('span', { style: { opacity: 0.6, fontWeight: 700 } }, '4'),
    },
    {
      key: '1-5',
      description: 'How to quickly install and import components?',
      icon: h('span', { style: { opacity: 0.6, fontWeight: 700 } }, '5'),
    },
  ],
};

const DESIGN_GUIDE = {
  key: '2',
  label: 'Design Guide',
  children: [
    {
      key: '2-1',
      icon: h(HeartOutlined),
      label: 'Intention',
      description: 'AI understands user needs and provides solutions.',
    },
    {
      key: '2-2',
      icon: h(SmileOutlined),
      label: 'Role',
      description: "AI's public persona and image",
    },
    {
      key: '2-3',
      icon: h(CommentOutlined),
      label: 'Chat',
      description: 'How AI Can Express Itself in a Way Users Understand',
    },
    {
      key: '2-4',
      icon: h(PaperClipOutlined),
      label: 'Interface',
      description: 'AI balances "chat" & "do" behaviors.',
    },
  ],
};

const SENDER_PROMPTS: PromptsProps['items'] = [
  {
    key: '1',
    description: 'Upgrades',
    icon: h(ScheduleOutlined),
  },
  {
    key: '2',
    description: 'Components',
    icon: h(AppstoreOutlined),
  },
  {
    key: '3',
    description: 'RICH Guide',
    icon: h(FileSearchOutlined),
  },
  {
    key: '4',
    description: 'Installation Introduction',
    icon: h(AppstoreAddOutlined),
  },
];

// // Styles
const { token } = theme.useToken();
const styles = computed(() => {
  return {
    layout: {
      width: '100%',
      'min-width': '1000px',
      height: '722px',
      display: 'flex',
      background: `${token.value.colorBgContainer}`,
      'font-family': `AlibabaPuHuiTi, ${token.value.fontFamily}, sans-serif`,
    },
    sider: {
      background: `${token.value.colorBgLayout}80`,
      width: '280px',
      height: '100%',
      display: 'flex',
      'flex-direction': 'column',
      padding: '0 12px',
      'box-sizing': 'border-box',
    },
    logo: {
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'start',
      padding: '0 24px',
      'box-sizing': 'border-box',
      gap: '8px',
      margin: '24px 0',
    },
    logoTitle: {
      'font-weight': 'bold',
      color: `${token.value.colorText}`,
      'font-size': '16px',
    },
    addBtn: {
      background: '#1677ff0f',
      border: '1px solid #1677ff34',
      height: '40px',
    },
    conversations: {
      flex: 1,
      'overflow-y': 'auto',
      'margin-top': '12px',
      padding: 0,
    },
    siderFooter: {
      'border-top': `1px solid ${token.value.colorBorderSecondary}`,
      height: '40px',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'space-between',
    },
    chat: {
      height: '100%',
      width: '100%',
      'box-sizing': 'border-box',
      display: 'flex',
      'flex-direction': 'column',
      'padding-block': `${token.value.paddingLG}px`,
      gap: '16px',
    },
    chatList: {
      flex: 1,
      overflow: 'auto',
    },
    loadingMessage: {
      'background-image': 'linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%)',
      'background-size': '100% 2px',
      'background-repeat': 'no-repeat',
      'background-position': 'bottom',
    },
    placeholder: {
      'padding-top': '32px',
    },
    sender: {
      width: '100%',
      'max-width': '700px',
      margin: '0 auto',
    },
    speechButton: {
      'font-size': '18px',
      color: `${token.value.colorText} !important`,
    },
    senderPrompt: {
      width: '100%',
      'max-width': '700px',
      margin: '0 auto',
      color: `${token.value.colorText}`,
    },
  } as const;
});

// const { isDark } = useData();
const isDark = ref(false);

// // State
const abortController = ref<AbortController | null>(null);
const messageHistory = ref<Record<string, any>>({});
const conversations = ref(DEFAULT_CONVERSATIONS_ITEMS);
const curConversation = ref(DEFAULT_CONVERSATIONS_ITEMS[0].key);
const attachmentsOpen = ref(false);
const attachedFiles = ref<AttachmentsProps['items']>([]);
const inputValue = ref('');

// Agent and Chat
const [agent] = useXAgent<BubbleDataType>({
  baseURL: 'https://api.x.ant.design/api/llm_siliconflow_deepSeek-r1-distill-1wen-7b',
  model: 'DeepSeek-R1-Distill-Qwen-7B',
  dangerouslyApiKey: 'Bearer sk-xxxxxxxxxxxxxxxxxxxx',
});

const loading = ref(false);
// watch(() => agent.value.isRequesting(), () => {
//   loading.value = agent.value.isRequesting();
// });

const { onRequest, messages, setMessages } = useXChat({
  agent: agent.value,
  requestFallback: (_, { error }) => {
    if (error.name === 'AbortError') {
      return {
        content: 'Request is aborted',
        role: 'assistant',
      };
    }
    return {
      content: 'Request failed, please try again!',
      role: 'assistant',
    };
  },
  transformMessage: (info) => {
    const { originMessage, chunk } = info || {};
    let currentContent = '';
    let currentThink = '';
    try {
      if (chunk?.data && !chunk?.data.includes('DONE')) {
        const message = JSON.parse(chunk?.data);
        currentThink = message?.choices?.[0]?.delta?.reasoning_content || '';
        currentContent = message?.choices?.[0]?.delta?.content || '';
      }
    } catch (error) {
      console.error(error);
    }

    let content = '';

    if (!originMessage?.content && currentThink) {
      content = `<think>${currentThink}`;
    } else if (
      originMessage?.content?.includes('<think>') &&
      !originMessage?.content.includes('</think>') &&
      currentContent
    ) {
      content = `${originMessage?.content}</think>${currentContent}`;
    } else {
      content = `${originMessage?.content || ''}${currentThink}${currentContent}`;
    }
    return {
      content: content,
      role: 'assistant',
    };
  },
  resolveAbortController: (controller) => {
    abortController.value = controller;
  },
});

// Computed
const bubbleItems = computed(() => {
  return messages.value?.map((i) => ({
    ...i.message,
    styles: {
      content: i.status === 'loading' ? styles.value.loadingMessage : undefined,
    },
    typing: i.status === 'loading' ? { step: 5, interval: 20, suffix: h('span', {}, '💗') } : false,
  }));
});

const bubbleRoles = {
  assistant: {
    placement: 'start' as const,
    footer: h('div', { style: { display: 'flex' } }, [
      h(Button, { type: 'text', size: 'small', icon: h(ReloadOutlined) }),
      h(Button, { type: 'text', size: 'small', icon: h(CopyOutlined) }),
      h(Button, { type: 'text', size: 'small', icon: h(LikeOutlined) }),
      h(Button, { type: 'text', size: 'small', icon: h(DislikeOutlined) }),
    ]),
    loadingRender: () => h(Spin, { size: 'small' }),
  },
  user: { placement: 'end' as const },
};

const promptsStyles = computed(() => ({
  list: { height: '100%' },
  item: {
    flex: 1,
    backgroundImage: isDark.value
      ? 'linear-gradient(123deg, #1e2a38 0%, #2b1f3b 100%)'
      : 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
    borderRadius: '12px',
    border: 'none',
  },
  subItem: { padding: 0, background: 'transparent' },
}));

const guideStyles = computed(() => ({
  item: {
    flex: 1,
    backgroundImage: isDark.value
      ? 'linear-gradient(123deg, #1e2a38 0%, #2b1f3b 100%)'
      : 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
    borderRadius: '12px',
    border: 'none',
  },
  subItem: { background: isDark.value ? undefined : '#ffffffa6' },
}));

const senderHeader = h(Sender.Header, {
  title: 'Upload File',
  open: attachmentsOpen.value,
  'onUpdate:open': (open: boolean) => attachmentsOpen.value = open,
  styles: {
    content: {
      padding: 0,
    },
  }
}, {
  default: () => h(Attachments, {
    beforeUpload: () => false,
    items: attachedFiles.value,
    'onUpdate:items': (fileList: AttachmentsProps['items']) => attachedFiles.value = fileList,
    placeholder: (type) =>
      type === 'drop'
        ? { title: 'Drop file here' }
        : {
            icon: h(CloudUploadOutlined),
            title: 'Upload files',
            description: 'Click or drag files to this area to upload',
          }
  })
});

const senderPrefix = h(Button, {
  type: 'text',
  icon: h(PaperClipOutlined, { style: { fontSize: '18px' } }),
  onClick: () => attachmentsOpen.value = !attachmentsOpen.value
});

const senderActions = (_: any, info: any) => {
  const { SendButton, LoadingButton, SpeechButton } = info.components;
  return h(Flex, { gap: 4 }, () => [
    h(SpeechButton, { style: styles.value.speechButton }),
    loading.value 
      ? h(LoadingButton, { type: 'default' }) 
      : h(SendButton, { type: 'primary' })
  ]);
};

const conversationMenu = (conversation: any) => ({
  items: [
    {
      label: 'Rename',
      key: 'rename',
      icon: h(EditOutlined),
    },
    {
      label: 'Delete',
      key: 'delete',
      icon: h(DeleteOutlined),
      danger: true,
      onClick: () => {
        const newList = conversations.value.filter((item) => item.key !== conversation.key);
        const newKey = newList?.[0]?.key;
        conversations.value = newList;
        // The delete operation modifies curConversation and triggers onActiveChange, so it needs to be executed with a delay to ensure it overrides correctly at the end.
        // This feature will be fixed in a future version.
        setTimeout(() => {
          if (conversation.key === curConversation.value) {
            curConversation.value = newKey || '';
            setMessages(messageHistory.value?.[newKey] || []);
          }
        }, 200);
      },
    },
  ],
});

// Methods
const handleSubmit = () => {
  if (!inputValue.value) return;

  if (loading.value) {
    message.error('Request is in progress, please wait for the request to complete.');
    return;
  }

  onRequest({
    stream: true,
    message: { role: 'user', content: inputValue.value },
  });
  
  inputValue.value = '';
};

const handleCancel = () => {
  abortController.value?.abort();
};

const handleNewConversation = () => {
  if (loading.value) {
    message.error(
      'Message is Requesting, you can create a new conversation after request done or abort it right now...',
    );
    return;
  }

  const now = dayjs().valueOf().toString();
  conversations.value = [
    {
      key: now,
      label: `New Conversation ${conversations.value.length + 1}`,
      group: 'Today',
    },
    ...conversations.value,
  ];
  curConversation.value = now;
  messages.value = [];
};

const handleActiveChange = async (val: string) => {
  abortController.value?.abort();
  // The abort execution will trigger an asynchronous requestFallback, which may lead to timing issues.
  // In future versions, the sessionId capability will be added to resolve this problem.
  setTimeout(() => {
    curConversation.value = val;
    messages.value = messageHistory.value?.[val] || [];
  }, 100);
};

const handleTopicClick = (info: any) => {
  onRequest({
    stream: true,
    message: { role: 'user', content: info.data.description as string },
  });
};

const handleGuideClick = (info: any) => {
  onRequest({
    stream: true,
    message: { role: 'user', content: info.data.description as string },
  });
};

const handleSenderPromptClick = (info: any) => {
  onRequest({
    stream: true,
    message: { role: 'user', content: info.data.description as string },
  });
};

// Watchers
watch(messages, () => {
  // history mock
  if (messages.value?.length) {
    messageHistory.value = {
      ...messageHistory.value,
      [curConversation.value]: messages.value,
    };
  }
});



</script>

<style scoped lang="less"></style>
```