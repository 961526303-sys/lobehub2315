'use client';

import { Button, Flexbox } from '@lobehub/ui';
import { useModalContext } from '@lobehub/ui/base-ui';
import { App, Form, Input } from 'antd';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';

import { workspaceService } from '@/services/workspace';
import { FETCH_WORKSPACES_KEY, useWorkspaceStore } from '@/store/workspace';

interface FormValues {
  description?: string;
  name: string;
}

const CreateWorkspaceContent = memo(() => {
  const { t } = useTranslation('setting');
  const { close } = useModalContext();
  const { message } = App.useApp();
  const switchWorkspace = useWorkspaceStore((s) => s.switchWorkspace);

  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const created = await workspaceService.create({
        description: values.description?.trim() || undefined,
        name: values.name.trim(),
      });

      await mutate(FETCH_WORKSPACES_KEY);

      if (created?.id) switchWorkspace(created.id);

      close();
    } catch (error) {
      console.error('[create workspace] failed', error);
      message.error((error as Error).message || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" style={{ padding: 24 }} onFinish={onSubmit}>
      <Form.Item
        label={t('workspace.name.title')}
        name="name"
        rules={[{ max: 255, min: 1, required: true }]}
      >
        <Input autoFocus placeholder={t('workspace.create.namePlaceholder')} />
      </Form.Item>
      <Form.Item
        label={t('workspace.description.title')}
        name="description"
        rules={[{ max: 1000 }]}
      >
        <Input.TextArea placeholder={t('workspace.create.descPlaceholder')} rows={3} />
      </Form.Item>
      <Flexbox horizontal justify="flex-end">
        <Button htmlType="submit" loading={loading} type="primary">
          {t('workspace.create.submit')}
        </Button>
      </Flexbox>
    </Form>
  );
});

CreateWorkspaceContent.displayName = 'CreateWorkspaceContent';

export default CreateWorkspaceContent;
