import React from 'react';
import { Typography, Button, Row } from 'antd';
import { ROLES } from '@/src/utils/constants/app-constants';

const { Title, Text } = Typography;

interface UserProfileViewerProps {
  user: any;
  userRole: string;
  setViewClientProfile: (user: any) => void;
  handleStartImpersonation?: (targetUserId: number) => void;
}

const UserProfileViewer: React.FC<UserProfileViewerProps> = ({
  user,
  userRole,
  setViewClientProfile,
  handleStartImpersonation,
}) => (
    <Row gutter={[24, 16]} align={'middle'} className="mt-0 filters pl-4">
    <Title
      level={3}
      onClick={() => setViewClientProfile(user)}
      className="mt-7 mb-7 cms-user-text"
    >
      <a>{user?.name}</a>
      
      <Text className='cursor-pointer flex items-center'><i
        style={{ marginLeft: '8px', marginRight: '8px' }}
        className="icon-user"
      ></i> {user?.company}</Text>
    </Title>
    <div className="flex items-center gap-4">
    {userRole === ROLES.ADMIN && (
      <Button
        className="ml-4 client-impersonate-button"
        type="text"
        onClick={() => handleStartImpersonation && handleStartImpersonation(user.id)}
      >
        Enter CMS View
      </Button>
    )}
    </div>
  </Row>
);

export default UserProfileViewer;
