import { ArrowLeftOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { FormatDate, QueryPATH } from '../../../components';
import { useState } from 'react';
import { Delete, GetById } from '../../../services';
import { useQueryClient } from '@tanstack/react-query';
import Groups from '../Groups/Groups';

const StudentsMore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const { data = {}, isLoading } = GetById(
    QueryPATH.studentsMore,
    id,
    cookies.token,
    '/students'
  );
  const { mutate: StudentDel, isPending } = Delete(
    '/students',
    cookies.token,
    id,
    navigate,
    QueryPATH.students,
    queryClient
  );
  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-[25px] duration-300 hover:scale-[1.2] cursor-pointer"
          >
            <ArrowLeftOutlined />
          </button>
          <h1 className="font-bold text-[25px]">
            {isLoading ? 'loading...' : data.name}
          </h1>
          <h1 className="text-[27px] font-bold">Students more</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setDeleteModal(true)}
            size="large"
            className="bg-red-500!"
            type="primary"
            icon={<DeleteFilled />}
          ></Button>
          <Button
            onClick={() => navigate('update')}
            icon={<EditFilled />}
            size="large"
            type="primary"
          >
            Update
          </Button>
        </div>
      </div>
      <div className="p-5 mb-10 flex justify-between border mt-5 border-slate-400 rounded-xl w-[50%]">
        <ul className=" flex flex-col gap-5 ">
          <li className="flex flex-col">
            <span className="text-[10px] text-slate-400">#ID</span>
            <strong>{data.id}</strong>
          </li>
          <li className="flex flex-col">
            <span className="text-[10px] text-slate-400">Name</span>
            <li className="flex gap-2">
              <strong>{data.firstName}</strong>
              <strong>{data.lastName}</strong>
            </li>
          </li>
          <li className="flex flex-col">
            <span className="text-[10px] text-slate-400">Email</span>
            <strong>{data.email}</strong>
          </li>
        </ul>
        <ul className=" flex flex-col gap-5 ">
          <li className="flex flex-col">
            <span className="text-[10px] text-slate-400">Create At</span>
            <strong>{FormatDate(data.createdAt)}</strong>
          </li>
          <li className="flex flex-col">
            <span className="text-[10px] text-slate-400">Updated At</span>
            <strong>{FormatDate(data.updatedAt)}</strong>
          </li>
        </ul>
      </div>
      <Modal
        confirmLoading={isPending}
        onOk={() => StudentDel()}
        open={deleteModal}
        onCancel={() => setDeleteModal(false)}
        title="Do you want to delete!"
      ></Modal>

      <div className="bg-slate-100 rounded-md">
        <Groups title={`/ ${data.name}`} stackId={id} />
      </div>
    </div>
  );
};

export default StudentsMore;
