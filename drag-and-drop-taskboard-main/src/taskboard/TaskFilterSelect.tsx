import { Select } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../shared/AppContext';

const { Option } = Select;

export function TaskFilterSelect() {
  const [children, setChildren] = useState([] as React.ReactNode[]);
  let appContext = useContext(AppContext);

  useEffect(() => {
    let childs: React.ReactNode[] = [];
    appContext.allJobTitles.forEach((val) => {
      childs.push(
        <Option value={val} key={val}>
          {val}
        </Option>
      );
    });
    setChildren(childs);
  }, [appContext.allJobTitles]);

  function handleSelect(value: string) {
    let selectedArr: string[] = [...appContext.filteredJobTitles, value];
    appContext.setFilteredJobTitles(selectedArr);
  }

  function handleDeselect(value: string) {
    let selectedArr: string[] = [...appContext.filteredJobTitles];
    selectedArr.splice(selectedArr.indexOf(value), 1);
    appContext.setFilteredJobTitles(selectedArr);
  }

  return (
    <span id="filter-container">
      <label htmlFor="jobTitleFilter">Show Only : </label>
      <Select
        id="jobTitleFilter"
        mode="multiple"
        allowClear
        style={{ width: '50%' }}
        placeholder="Please select"
        onSelect={handleSelect}
        onDeselect={handleDeselect}
        disabled={!appContext.isLoggedIn}
      >
        {children}
      </Select>
    </span>
  );
}
