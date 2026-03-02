import { ArrowLeftOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { FormatDate, QueryPATH } from '../../../components';
import { useState } from 'react';
import { Delete, GetById } from '../../../services';
import { useQueryClient } from '@tanstack/react-query';
import Groups from '../Groups/Groups';

const TeachersMore = () => {
  const { id: teachersId } = useParams<{ id: string }>();
  console.log(teachersId);
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const { data = {}, isLoading } = GetById(
    QueryPATH.teachersMore,
    teachersId,
    cookies.token,
    '/teachers'
  );

  const { mutate: TeacherDel, isPending } = Delete(
    '/teachers',
    cookies.token,
    teachersId,
    navigate,
    QueryPATH.teachers,
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
            {isLoading ? 'Loading...' : `${data.firstName} ${data.lastName}`}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setDeleteModal(true)}
            size="large"
            className="bg-red-500!"
            type="primary"
            icon={<DeleteFilled />}
          />

          <Button
            size="large"
            type="primary"
            icon={<EditFilled />}
            onClick={() => navigate(`/teachers/${teachersId}/update`)}
          >
            Update
          </Button>
        </div>
      </div>

      <div className="p-5 mb-10 flex justify-between border mt-5 border-slate-400 rounded-xl w-[50%]">
        <ul className="flex flex-col gap-5">
          <li className="flex flex-col">
            <span className="text-[10px] text-slate-400">#ID</span>
            <strong>{data.id}</strong>
          </li>

          <li className="flex flex-col">
            <span className="text-[10px] text-slate-400">Name</span>
            <div className="flex gap-2">
              <strong>{data.firstName}</strong>
              <strong>{data.lastName}</strong>
            </div>
          </li>

          <li className="flex flex-col">
            <span className="text-[10px] text-slate-400">Email</span>
            <strong>{data.email}</strong>
          </li>

          <li className="flex flex-col">
            <span className="text-[10px] text-slate-400">Phone</span>
            <strong>{data.phone}</strong>
          </li>
        </ul>

        <ul className="flex flex-col gap-5">
          <li className="flex flex-col">
            <span className="text-[10px] text-slate-400">Created At</span>
            <strong>{data.createdAt ? FormatDate(data.createdAt) : '-'}</strong>
          </li>

          <li className="flex flex-col">
            <span className="text-[10px] text-slate-400">Updated At</span>
            <strong>{data.updatedAt ? FormatDate(data.updatedAt) : '-'}</strong>
          </li>
        </ul>
      </div>

      <Modal
        confirmLoading={isPending}
        onOk={() => TeacherDel()}
        open={deleteModal}
        onCancel={() => setDeleteModal(false)}
        title="Do you want to delete?"
      />

      <div className="bg-slate-100 rounded-md">
        <Groups title={`/ ${data.name}`} stackId={teachersId} />
      </div>
    </div>
  );
};

export default TeachersMore;
