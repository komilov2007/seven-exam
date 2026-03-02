import { Route, Routes } from 'react-router-dom';
import { PATH } from '../components';
import {
  DashboardHome,
  GroupMore,
  Groups,
  GroupsCrud,
  Rooms,
  StackCrud,
  StackMore,
  Stacks,
  Students,
  TeacherCrud,
  Teachers,
} from '../pages';
import { Header, Sitebar } from '../modules';
import { useContext } from 'react';
import { Context } from '../context/Context';
import TeachersMore from '../pages/Dashboard/Teachers/TeachersMore';
import StudentsCrud from '../pages/Dashboard/Students/StudentsCrud';
import StudentsMore from '../pages/Dashboard/Students/StudentsMore';

const DashboardRoute = () => {
  const { collepsed } = useContext(Context);
  const list = [
    { id: 1, path: PATH.home, element: <DashboardHome /> },

    { id: 2, path: PATH.stacks, element: <Stacks /> },
    { id: 3, path: PATH.stacksMore, element: <StackMore /> },
    { id: 4, path: PATH.stacksCreate, element: <StackCrud /> },
    { id: 5, path: PATH.stacksUpdate, element: <StackCrud /> },
    { id: 11, path: PATH.stacksCreateByGroup, element: <GroupsCrud /> },

    { id: 6, path: PATH.groups, element: <Groups /> },
    { id: 10, path: PATH.groupsCreate, element: <GroupsCrud /> },
    { id: 12, path: PATH.groupsMore, element: <GroupMore /> },
    { id: 13, path: PATH.groupsUpdate, element: <GroupsCrud /> },

    { id: 7, path: PATH.teachers, element: <Teachers /> },
    { id: 15, path: PATH.teachersCreate, element: <TeacherCrud /> },
    { id: 17, path: PATH.teachersMore, element: <TeachersMore /> },
    { id: 16, path: PATH.teachersUpdate, element: <TeacherCrud /> },
    { id: 11, path: PATH.teachersCreateByGroup, element: <GroupsCrud /> },

    { id: 8, path: PATH.students, element: <Students /> },
    { id: 18, path: PATH.studentsCreate, element: <StudentsCrud /> },
    { id: 19, path: PATH.studentsMore, element: <StudentsMore /> },
    { id: 20, path: PATH.studentsUpdate, element: <StudentsCrud /> },
    { id: 11, path: PATH.studentsCreateByGroup, element: <GroupsCrud /> },

    { id: 9, path: PATH.rooms, element: <Rooms /> },
  ];
  return (
    <div className="flex">
      <Sitebar />
      <div
        className={`${collepsed ? 'w-full' : 'w-[78%]'} duration-300 mt-12 h-screen overflow-y-auto`}
      >
        <Header />
        <Routes>
          {list.map((item) => (
            <Route key={item.id} path={item.path} element={item.element} />
          ))}
        </Routes>
      </div>
    </div>
  );
};

export default DashboardRoute;
