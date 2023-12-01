"use client";
import { useEffect, useRef, useState } from "react";
import { collection, query, onSnapshot, where, getFirestore, doc, getDoc } from "firebase/firestore";

import Clock from "@/components/Clock";
import { db } from "@/plugins/firebase";
export default function page({ params }: { params: { slug: string } }) {
  const [yourQueue, setYourQueue] = useState<Queue>();
  const [current, setCurrent] = useState<Queue>();
  const [animate, setAnimate] = useState(``);
  const prevQueRef = useRef<CurrentQueue>();
  useEffect(() => {
    fetchQueue(params.slug);
    fetchCurrent();
  }, []);

  const fetchQueue = async (id: string) => {
    const docRef = doc(db, "queue", id);
    const docSnap = await getDoc(docRef);
    setYourQueue(docSnap.data() as Queue);

    prevQueRef.current = docSnap.data() as CurrentQueue;
  };

  const fetchCurrent = () => {
    const ref = collection(db, "queue");
    const q = query(ref, where("deletedAt", "==", null));

    onSnapshot(q, (querySnapshot) => {
      let items: any = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      items.sort((a: any, b: any) => {
        if (a.queue > b.queue) return 1;
        else return -1;
      });
      items = items.slice(0, 1);

      items.sort((a: any, b: any) => {
        if (a.queue > b.queue) return -1;
        else return 1;
      });
      if (items[0])
        if (prevQueRef.current || items[0]) {
          if (prevQueRef.current?.callCount !== items[0]?.callCount || prevQueRef.current?.id !== items[0]?.id) {
            if (items[0]?.id === params.slug) {
              runAnimate();
            }
          }
        }
      setCurrent(items[0]);
    });
  };

  function runAnimate() {
    setAnimate("blink-currrent");
    let playQueueSuccessSound = new Audio("/quesuccess.mp3");
    playQueueSuccessSound.volume = 0.4;
    playQueueSuccessSound.play();
    let count = 3;
    let timer = setInterval(() => {
      count--;
      if (count == 0) {
        setAnimate("");
        clearInterval(timer);
      }
    }, 1000);
  }
  return (
    <div className="min-h-screen px-auto pt-5 ">
      <div className="flex items-center justify-center bg-slate-100">
        <Clock />
      </div>
      <div className="flex items-center justify-center pt-2 px-20">
        <table className="table-auto border border-collapse w-full ">
          <thead>
            <tr>
              <th className="border p-8 sm:text-5xl xs:text-3xl xxs:text-2xl">Your Queue</th>
              <th className="border p-8 sm:text-5xl xs:text-3xl xxs:text-2xl">Current Queue</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan={6} className="border w-1/2">
                {yourQueue ? (
                  <>
                    <div className="flex justify-center items-center">
                      <div
                        className={`w-full h-full border-2 rounded-md p-10 border-emerald-400 bg-emerald-400 flex flex-col justify-center items-center md:text-7xl xs:text-5xl xxs:text-2xl text-white text-center 
                         ${animate}`}
                      >
                        {`Q-${String(yourQueue.queue).padStart(2, "0")}`}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col justify-center items-center">
                      <div
                        className={`w-full h-full border-2 rounded-md p-10 border-red-400 bg-red-400 flex flex-col justify-center items-center md:text-7xl xs:text-5xl xxs:text-2xl text-white text-center 
                         ${animate}`}
                      >
                        {`NO QUEUE`}
                      </div>
                    </div>
                  </>
                )}
              </td>
            </tr>
            <tr>
              <td rowSpan={6} className="border w-1/2">
                {current ? (
                  <>
                    <div className="flex justify-center items-center">
                      <div
                        className={`w-full h-full border-2 rounded-md p-10 border-blue-400 bg-blue-400 flex flex-col justify-center items-center md:text-7xl xs:text-5xl xxs:text-2xl text-white text-center 
                         ${animate}`}
                      >
                        {`Q-${String(current.queue).padStart(2, "0")}`}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col justify-center items-center">
                      <div
                        className={`w-full h-full border-2 rounded-md p-10 border-red-400 bg-red-400 flex flex-col justify-center items-center md:text-7xl xs:text-5xl xxs:text-2xl text-white text-center 
                         ${animate}`}
                      >
                        {`NO QUEUE`}
                      </div>
                    </div>
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {!yourQueue ? (
        <>
          <div className="flex items-center justify-center mt-5 bg-slate-100">
            <p className="text-red-700">*หมายเลขคิวไม่ถูกต้อง</p>
          </div>
        </>
      ) : (
        <></>
      )}
      {!current ? (
        <>
          <div className="flex items-center justify-center mt-5 bg-slate-100">
            <p className="text-red-700">*ไม่มีคิวที่ดำเนินการอยู่</p>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
