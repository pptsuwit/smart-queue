"use client";
import { useEffect, useState } from "react";
import { collection, addDoc, query, onSnapshot, deleteDoc, doc, where, orderBy, limit } from "firebase/firestore";

import Clock from "./components/Clock";
import { db } from "./plugins/firebase";

export default function Home() {
  const [queue, setQueue] = useState<Queue[]>([]);
  const [current, setCurrent] = useState<Queue>();
  const [animate, setAnimate] = useState(`blink-currrent`);
  useEffect(() => {
    fetchQueue();
    fetchCurrent();
  }, []);

  const fetchQueue = () => {
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
      items = items.slice(1, 6);

      items.sort((a: any, b: any) => {
        if (a.queue > b.queue) return -1;
        else return 1;
      });
      setQueue(items);
    });
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
      setCurrent(items[0]);
      if (items[0]) runAnimate();
    });
  };

  function runAnimate() {
    setAnimate("blink-currrent");
    const playQueueSuccessSound = new Audio("/quesuccess.mp3");
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
    <main className="min-h-screen px-auto pt-5 ">
      <div className="flex items-center justify-center bg-slate-100">
        <Clock />
      </div>
      <div className="flex items-center justify-center pt-2 px-20 pb-20">
        <table className="table-auto border border-collapse w-full">
          <thead>
            <tr>
              <th className="border p-8 text-5xl">Current</th>
              <th className="border p-8 text-5xl">Queue</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan={6} className="border w-2/3">
                {current ? (
                  <>
                    <div className="flex justify-center items-center">
                      <div
                        className={`w-full h-full border-2 rounded-md p-10 border-emerald-400 bg-emerald-400 flex flex-col justify-center items-center text-7xl text-white text-center 
                         ${animate}`}
                      >
                        {current.queue}
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </td>
            </tr>
            {queue.map((item, index) => (
              <tr key={index}>
                <td className="border ">
                  <div className="flex justify-center items-center ">
                    <span
                      className={`w-full border-2 rounded-md px-2 border-blue-300 bg-blue-300 text-3xl text-white text-center py-1.5
                   `}
                    >
                      {`Q-${String(item.queue).padStart(2, "0")}`}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
