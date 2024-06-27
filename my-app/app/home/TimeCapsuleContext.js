import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchTimeCapsules, addTimeCapsule } from './firebaseUtils';

const TimeCapsuleContext = createContext();

export const TimeCapsuleProvider = ({ children }) => {
  const [timeCapsules, setTimeCapsules] = useState([]);

  useEffect(() => {
    const loadTimeCapsules = async () => {
      const capsules = await fetchTimeCapsules();
      setTimeCapsules(capsules);
    };
    loadTimeCapsules();
  }, []);

  return (
    <TimeCapsuleContext.Provider value={{ timeCapsules, setTimeCapsules, addTimeCapsule }}>
      {children}
    </TimeCapsuleContext.Provider>
  );
};

export const useTimeCapsules = () => {
  return useContext(TimeCapsuleContext);
};
