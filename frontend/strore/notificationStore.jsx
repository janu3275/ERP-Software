// notificationStore.js
import {create} from 'zustand';
import {persist} from "zustand/middleware";

export const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (notification) => {
    console.log("notification added", notification)
    set((state) => ({ notifications: [ notification] }))
      // Set a timeout to remove the notification after a certain time
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== notification.id),
        }));
      }, notification.displaytime);
  },
  removeNotification: (id) =>
    set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),
}));

let commonInfoStore = (set) => ({
  user: null,
  company: null,
  marketplace: null,
  marketimg: null,
  setUserInfo: (name) => set({ user: name }),
  setCompanyInfo: (name) => set({ company: name }),
  setMarketInfo: (name, img) => set({ marketplace: name , marketimg: img})
});
// persist the created state
commonInfoStore = persist(commonInfoStore, {name: "generalinfo"})
// create the store
export const useCommonInfoStore = create(commonInfoStore);



// Create a store to manage filter data
let filterStore = (set) => ({
  customerTableFilterData: [],
  setFilterData: ( tableName, newfilterData ) => {
  console.log(tableName, newfilterData)
  newfilterData = newfilterData.map((obj)=>obj?obj:null)
  console.log(tableName, newfilterData)
  set((state) => ({ ...state, [tableName]: newfilterData }))
  }, // state is used for the initial data 
  
});

filterStore  = persist(filterStore , { name: "tablefilters" })

export const useFilterStore = create(filterStore);



