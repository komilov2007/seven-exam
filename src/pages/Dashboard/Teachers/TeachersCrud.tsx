import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState, type SubmitEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Create, GetAll, GetById, Update } from '../../../services';
import { QueryPATH } from '../../../components';

type StackType = { id: number; name: string };

const TeachersCrud = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(['token']);
  const { id } = useParams<{ id: string }>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [stackId, setStackId] = useState<number | null>(null);

  const { data: stacksData = [] } = GetAll(
    [],
    '/stacks',
    cookies.token,
    QueryPATH.stacks
  );

  const stackOptions = useMemo(
    () =>
      (stacksData as StackType[]).map((s) => ({ label: s.name, value: s.id })),
    [stacksData]
  );

  const { mutate: teacherCreate, isPending: creating } = Create(
    '/teachers',
    cookies.token,
    navigate,
    queryClient,
    QueryPATH.teachers
  );

  const { mutate: teacherUpdate, isPending: updating } = Update(
    '/teachers',
    cookies.token,
    id,
    navigate,
    queryClient,
    QueryPATH.teachers,
    QueryPATH.teachersMore
  );

  const { data: singleInfo = {} } = id
    ? GetById(QueryPATH.teachersMore, id, cookies.token, '/teachers')
    : ({} as any);

  useEffect(() => {
    if (!id) return;

    const t = (singleInfo as any)?.data ?? singleInfo;
    if (!t || !Object.keys(t).length) return;

    setFirstName(t.firstName ?? t.firstname ?? '');
    setLastName(t.lastName ?? t.lastname ?? '');
    setEmail(t.email ?? '');
    setPhone(t.phone ?? '');

    const sid = t.stackId ?? t.stack?.id ?? null;
    setStackId(sid ? Number(sid) : null);

    setPassword('');
  }, [id, singleInfo]);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (id) {
      const payload = {
        firstName,
        lastName,
        email,
        phone,
        stackId,
      };

      teacherUpdate(payload as any);
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      phone,
      stackId: Number(stackId),
      password: password || 'Password.123!',
    };

    teacherCreate(payload as any);
  }

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="p-5 flex flex-col gap-4 w-[50%]"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <button type="button" onClick={() => navigate(-1)}>
            <ArrowLeftOutlined className="cursor-pointer text-[25px]" />
          </button>
          <h2 className="font-bold text-[25px]">
            {id ? 'Update' : 'Create'} Teacher
          </h2>
        </div>

        <Button
          loading={creating || updating}
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          size="large"
        >
          Save
        </Button>
      </div>

      <Input
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <Input
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {!id && (
        <Input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
      )}

      <Select
        placeholder="Select Stack"
        value={stackId ?? undefined}
        onChange={(v) => setStackId(Number(v))}
        options={stackOptions}
      />
    </form>
  );
};

export default TeachersCrud;
