import { db } from '@/service/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {

  const navigation = useNavigation();
  const [UserTrips,setUserTrips]=useState([]);

  useEffect(() => {
    GetUserTrips();
  },[])

  const GetUserTrips = async() => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      navigation('/')
      return;
    }

    
    const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));

    const querySnapshot = await getDocs(q);
    setUserTrips([]);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setUserTrips(prevVal=>[...prevVal,doc.data()])
    });
  }

  return (
    <div className='max-w-4xl mx-auto sm:px-16 px-5 mt-10 w-full mb-20'>
      <h2 className="font-bold text-3xl">MyTrips
      </h2>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-5 mt-10'>
        {UserTrips?.length>0?UserTrips.map((trip,index)=>(
          <UserTripCardItem trip={trip} key={index}/>
        ))
      :[1,2,3,4,5,6].map((item,index)=>(
        <div key={index} className='h-[100px] w-full bg-slate-200 animate-pulse rounded-xl'>

        </div>
      ))
      }
      </div>
      </div>
  )
}

export default MyTrips