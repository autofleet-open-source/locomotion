import React, { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import network from '../services/network';

const useSettings = () => {
  const [settingsList, setSettingsList] = useState({});
  const [workingHours, setWorkingHours] = useState({});
  const getSettings = async () => {
    const { data: settings } = await network.get('/api/v1/me/app-settings');
    setSettingsList(settings);
  };

  const getWorkingHours = async () => {
    const { data: workingHoursData } = await network.get('/api/v1/me/app-settings/working-hours');
    const prepWorkingHours = prepareWorkingHours(workingHoursData)
    setWorkingHours(prepWorkingHours);
  };

  const prepareWorkingHours = (workingHoursData) => {
    let preparedworkingHours = {};
    workingHoursData.map(timeSlot => {
      if(!preparedworkingHours[timeSlot.dayInWeek]) {
        preparedworkingHours[timeSlot.dayInWeek] = [];
      }

      preparedworkingHours[timeSlot.dayInWeek].push({start: timeSlot.startTime, end: timeSlot.endTime})
    })
    return preparedworkingHours;
  }

  return {
    settingsList,
    getSettings,
    getWorkingHours,
    workingHours
  };
};
export default createContainer(useSettings);
