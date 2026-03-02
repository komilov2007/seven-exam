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
      <div className="p-5 m flex flex-col justify-between border items-center ml-60 w! h-78! mt-5 border-slate-400 rounded-xl w-[50%]">
        <strong className="text-[30px]">More</strong>
        <ul className=" flex flex-col gap-5 ">
          <li className="flex items-center  border-t-4">
            <span className="mr-10 ml-8">Id</span>
            <li className="flex text-[20px] gap-2">
              <strong>{data.id}</strong>
            </li>
          </li>
          <li className="flex items-center border-t-4">
            <span className="mr-10 ml-2">Name</span>
            <li className="flex text-[20px] gap-2">
              <strong>{data.firstName}</strong>
              <strong>{data.lastName}</strong>
            </li>
          </li>

          <li className="flex  text-[20px] gap-2 border-t-4">
            <span className="mr-10">Email</span>
            <strong>{data.email}</strong>
          </li>
        </ul>
        <ul className=" flex flex-col gap-5 border-t-4 mt-2">
          <li className="flex items-center text-[20px]">
            <span className="mr-10">CReate at</span>
            <li className="flex text-[20px] gap-2">
              <strong>{data.createdAt}</strong>
            </li>
          </li>

          <li className="flex items-center text-[20px] border-t-4 mb-2!">
            <span className="mr-10">Update At </span>
            <li className="flex text-[20px] gap-2">
              <strong>{FormatDate(data.updatedAt)}</strong>
            </li>
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
