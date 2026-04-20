'use client';

import { Button, Flexbox, Text } from '@lobehub/ui';
import { useModalContext } from '@lobehub/ui/base-ui';
import { App, Form, Input } from 'antd';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';

import { workspaceService } from '@/services/workspace';
import { useUserStore } from '@/store/user';
import { userProfileSelectors } from '@/store/user/selectors';
import { FETCH_WORKSPACES_KEY, useWorkspaceStore, workspaceSelectors } from '@/store/workspace';

interface FormValues {
  name: string;
}

const UpgradeContent = memo(() => {
  const { t } = useTranslation('setting');
  const { close } = useModalContext();
  const { message } = App.useApp();

  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);

  const activeWorkspace = useWorkspaceStore(workspaceSelectors.activeWorkspace);
  const displayUserName = useUserStore(userProfileSelectors.displayUserName);

  const defaultName = activeWorkspace?.name
    ? `${activeWorkspace.name}'s Team`
    : displayUserName
      ? `${displayUserName}'s Team`
      : '';

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await workspaceService.upgradeToTeam({ name: values.name.trim() });
      await mutate(FETCH_WORKSPACES_KEY);
      close();
    } catch (error) {
      console.error('[upgrade to team] failed', error);
      message.error((error as Error).message || 'Failed to upgrade workspace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      initialValues={{ name: defaultName }}
      layout="vertical"
      style={{ padding: 24 }}
      onFinish={onSubmit}
    >
      <Form.Item
        label={t('workspace.name.title')}
        name="name"
        rules={[{ max: 255, min: 1, required: true }]}
      >
        <Input autoFocus placeholder={t('workspace.upgrade.modal.namePlaceholder')} />
      </Form.Item>
      <Text style={{ marginBlockEnd: 16 }} type="secondary">
        {t('workspace.upgrade.modal.hint')}
      </Text>
      <Flexbox horizontal justify="flex-end">
        <Button htmlType="submit" loading={loading} type="primary">
          {t('workspace.upgrade.modal.submit')}
        </Button>
      </Flexbox>
    </Form>
  );
});

UpgradeContent.displayName = 'UpgradeContent';

export default UpgradeContent;
