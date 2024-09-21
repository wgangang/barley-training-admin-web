import { createContext } from 'react';
import type { MessageInstance } from 'antd/es/message/interface';
import type { HookAPI } from 'antd/es/modal/useModal';

const ParentContext = createContext({
  messageApi: undefined as MessageInstance | undefined,
  modal: undefined as HookAPI | undefined,
  active: () => {
    console.log('parent context');
  }
});
export default ParentContext;
