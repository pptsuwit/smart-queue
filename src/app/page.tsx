"use client";
import { useEffect, useRef, useState } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";

import Clock from "../components/Clock";
import { db } from "../plugins/firebase";

export default function Home() {
  const [queue, setQueue] = useState<Queue[]>([]);
  const [current, setCurrent] = useState<Queue>();
  const [animate, setAnimate] = useState(``);
  const prevQueRef = useRef<CurrentQueue>();
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
      if (prevQueRef.current || items[0]) {
        if (prevQueRef.current?.callCount !== items[0]?.callCount || prevQueRef.current?.id !== items[0]?.id) {
          runAnimate();
          prevQueRef.current = items[0];
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
    <main className="min-h-screen px-auto pt-5 ">
      <div className="flex items-center justify-center bg-slate-100">
        <Clock />
      </div>
      <div className="flex items-center justify-center pt-2 px-20 pb-20">
        <table className="table-auto border border-collapse w-full ">
          <thead>
            <tr>
              <th className="border p-8 sm:text-5xl xs:text-3xl xxs:text-2xl">Current</th>
              <th className="border p-8 sm:text-5xl xs:text-3xl xxs:text-2xl">Queue</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan={6} className="border w-2/3">
                {current ? (
                  <>
                    <div className="flex justify-center items-center">
                      <div
                        className={`w-full h-full border-2 rounded-md p-10 border-emerald-400 bg-emerald-400 flex flex-col justify-center items-center md:text-7xl xs:text-5xl xxs:text-2xl text-white text-center 
                         ${animate}`}
                      >
                        {`Q-${String(current.queue).padStart(2, "0")}`}
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
                      className={`w-full border-2 rounded-md px-2 border-blue-300 bg-blue-300 sm:text-3xl xxs:text-xl text-white text-center py-1.5
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
