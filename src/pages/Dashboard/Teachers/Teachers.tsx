import { MoreOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Input, Select, Table } from 'antd';
import { debounce } from '../../../hooks';
import { useCookies } from 'react-cookie';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetAll } from '../../../services';
import { Caption, QueryPATH } from '../../../components';

const TeachersPage = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);

  const [search, setSearch] = useState<string>('');
  const name = debounce(search, 500);

  const [stackId, setStackId] = useState<number | undefined>(undefined);

  const { data: stacks = [] } = GetAll(
    [],
    '/stacks',
    cookies.token,
    QueryPATH.stacks
  );

  const stackOptions = useMemo(
    () => stacks.map((s: any) => ({ label: s.name, value: s.id })),
    [stacks]
  );

  const { data: teachers = [], isLoading } = GetAll(
    [name, stackId],
    '/teachers',
    cookies.token,
    QueryPATH.teachers,
    { name, stackId }
  );

  const columns = [
    {
      title: 'Full Name',
      key: 'fullName',
      render: (_: any, record: any) => `${record.firstName} ${record.lastName}`,
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Stack',
      key: 'stack',
      render: (_: any, record: any) =>
        record?.stack?.name || record?.stackId || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          onClick={() => navigate(`${record.id}`)}
          className="border! !bg-blue text-white! border-white!"
          type="primary"
          icon={<MoreOutlined />}
        />
      ),
    },
  ];

  return (
    <div className="p-5 mt-15!">
      <Caption
        title="Teachers"
        count={teachers.length}
        icon={<PlusCircleOutlined />}
      />

      <div className="mt-5 flex gap-3 w-[75%]">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
          allowClear
          size="large"
          placeholder="Search by name"
        />

        <Select
          allowClear
          size="large"
          className="w-[250px]"
          placeholder="Filter by stack"
          options={stackOptions}
          value={stackId}
          onChange={(v) => setStackId(v)}
        />
      </div>

      <div className="mt-5">
        <Table
          loading={isLoading}
          rowKey="id"
          columns={columns}
          dataSource={teachers}
          pagination={{ pageSize: 7 }}
        />
      </div>
    </div>
  );
};

export default TeachersPage;
