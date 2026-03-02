import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, type SubmitEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Create, GetById, Update } from '../../../services';
import { QueryPATH } from '../../../components';

const StudentsCrud = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(['token']);
  const { id } = useParams<{ id: string }>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: studentCreate, isPending: creating } = Create(
    '/students',
    cookies.token,
    navigate,
    queryClient,
    QueryPATH.students
  );

  const { mutate: studentUpdate, isPending: updating } = Update(
    '/students',
    cookies.token,
    id,
    navigate,
    queryClient,
    QueryPATH.students,
    QueryPATH.studentsMore
  );
  const { data: singleInfo = {} } = id
    ? GetById(QueryPATH.studentsMore, id, cookies.token, '/students')
    : ({} as any);

  useEffect(() => {
    if (!id) return;

    const s = (singleInfo as any)?.data ?? singleInfo;
    if (!s) return;

    setFirstName(s.firstName ?? s.firstname ?? '');
    setLastName(s.lastName ?? s.lastname ?? '');
    setEmail(s.email ?? '');
    setPhone(s.phone ?? '');
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
      };

      studentUpdate(payload as any);
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      phone,
      password: password || 'Password.123!',
    };

    studentCreate(payload as any);
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
            <ArrowLeftOutlined className="text-[25px]" />
          </button>

          <h2 className="text-[25px] font-bold">
            {id ? 'Update' : 'Create'} Student
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
    </form>
  );
};

export default StudentsCrud;
