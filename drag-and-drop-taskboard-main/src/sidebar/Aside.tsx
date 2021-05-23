import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import {
  SketchOutlined,
  GithubOutlined,
  Html5Outlined,
  UnorderedListOutlined,
  AmazonCircleFilled,
  HeartOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const Aside = () => {
  return (
    <ProSidebar collapsed={true} breakPoint="md">
      <SidebarHeader>
        <div
          style={{
            padding: '24px 0px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 20,
            letterSpacing: '1px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          <Html5Outlined />
        </div>
      </SidebarHeader>
      <div className="divider"></div>
      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem
            icon={<SearchOutlined />}
            suffix={<span className="badge red">New</span>}
          >
            {'Dashboard'}
          </MenuItem>
          <MenuItem icon={<SketchOutlined />}>Components</MenuItem>
        </Menu>
        <div className="divider"></div>
        <Menu iconShape="circle">
          <SubMenu
            suffix={<span className="badge yellow">3</span>}
            title={'With Suffix'}
            icon={<AmazonCircleFilled />}
          >
            <MenuItem>SubMenu 1</MenuItem>
            <MenuItem>SubMenu 2</MenuItem>
            <MenuItem>SubMenu 3</MenuItem>
          </SubMenu>
          <SubMenu
            prefix={'<span className="badge gray">3</span>'}
            title={'With Prefix'}
            icon={<HeartOutlined />}
          >
            <MenuItem>SubMenu 1</MenuItem>
            <MenuItem>SubMenu 2</MenuItem>
            <MenuItem>SubMenu 3</MenuItem>
          </SubMenu>
          <SubMenu title={'Multi Level'} icon={<UnorderedListOutlined />}>
            <MenuItem>SubMenu 1 </MenuItem>
            <MenuItem>SubMenu 2 </MenuItem>
            <SubMenu title={`$SubMenu  3`}>
              <MenuItem>SubMenu 3.1 </MenuItem>
              <MenuItem>SubMenu 3.2 </MenuItem>
              <SubMenu title={`$SubMenu  3.3`}>
                <MenuItem>SubMenu 3.3.1 </MenuItem>
                <MenuItem>SubMenu 3.3.2 </MenuItem>
                <MenuItem>SubMenu SubMenu SubMenu 3.3.3 </MenuItem>
              </SubMenu>
            </SubMenu>
          </SubMenu>
        </Menu>
      </SidebarContent>

      <div className="divider"></div>
      <SidebarFooter style={{ textAlign: 'center' }}>
        <div className="sidebar-btn-wrapper">
          <span className="sidebar-btn">
            <GithubOutlined />
            <span>{'Account'}</span>
          </span>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default Aside;
