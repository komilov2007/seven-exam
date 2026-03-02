import { MoreOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Input, Table, Select } from 'antd';
import { debounce } from '../../../hooks';
import { useCookies } from 'react-cookie';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetAll } from '../../../services';
import { Caption, QueryPATH } from '../../../components';

type StackType = { id: number; name: string };
type TeacherType = { id: number; firstName: string; lastName: string };

const Students = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);

  const [search, setSearch] = useState<string>('');
  const name = debounce(search, 500);

  const [stackId, setStackId] = useState<number | null>(null);
  const [teacherId, setTeacherId] = useState<number | null>(null);

  const { data: stacksData = [] } = GetAll(
    [],
    '/stacks',
    cookies.token,
    QueryPATH.stacks
  );

  const stackOptions = useMemo(
    () =>
      (stacksData as StackType[]).map((s) => ({
        label: s.name,
        value: s.id,
      })),
    [stacksData]
  );

  const { data: teachersData = [] } = GetAll(
    [],
    '/teachers',
    cookies.token,
    QueryPATH.teachers
  );

  const teacherOptions = useMemo(
    () =>
      (teachersData as TeacherType[]).map((t) => ({
        label: `${t.firstName} ${t.lastName}`,
        value: t.id,
      })),
    [teachersData]
  );

  const params: any = {
    name,
    ...(stackId ? { stackId } : {}),
    ...(teacherId ? { teacherId } : {}),
  };

  const { data: students = [], isLoading } = GetAll(
    [name, stackId, teacherId],
    '/students',
    cookies.token,
    QueryPATH.students,
    params
  );

  const columns = [
    {
      title: 'Full Name',
      key: 'fullName',
      render: (_: any, record: any) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Actions',
      render: (_: any, record: any) => (
        <Button
          onClick={() => navigate(`${record.id}`)}
          className="bg-blue! border! text-white! border-white!"
          type="primary"
          icon={<MoreOutlined />}
        />
      ),
    },
  ];

  return (
    <div className="p-5">
      <Caption
        title="Students"
        count={students.length}
        icon={<PlusCircleOutlined />}
      />

      <div className="mt-5 flex gap-3">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          className="w-75!"
          allowClear
          size="large"
          placeholder="Search by name"
        />

        <Select
          allowClear
          size="large"
          placeholder="Filter by stack"
          options={stackOptions}
          value={stackId ?? undefined}
          onChange={(v) => setStackId(v ? Number(v) : null)}
          className="min-w-[200px]"
        />

        <Select
          allowClear
          size="large"
          placeholder="Filter by teacher"
          options={teacherOptions}
          value={teacherId ?? undefined}
          onChange={(v) => setTeacherId(v ? Number(v) : null)}
          className="min-w-[250px]"
        />
      </div>

      <div className="mt-5">
        <Table
          loading={isLoading}
          rowKey="id"
          columns={columns}
          dataSource={students}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default Students;
