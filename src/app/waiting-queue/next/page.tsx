"use client";

import Btn from "@/app/components/Btn";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { collection, query, onSnapshot, doc, updateDoc, where } from "firebase/firestore";
import { db } from "@/app/plugins/firebase";

export default function NewQueue() {
  const [queue, setQueue] = useState<number>(0);
  const [queueServed, setQueueServed] = useState<number>(0);
  const [current, setCurrent] = useState<CurrentQueue>();
  useEffect(() => {
    fetchQueue();
    fetchCurrent();
  }, []);

  function fetchCurrent() {
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
    });
  }

  const fetchQueue = () => {
    const ref = collection(db, "queue");
    const q = query(ref, where("deletedAt", "==", null));

    onSnapshot(q, (querySnapshot) => {
      let items: any = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });

      setQueue(items.length);
    });

    const qS = query(ref, where("deletedAt", "!=", null));
    onSnapshot(qS, (querySnapshot) => {
      let items: any = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      setQueueServed(items.length);
    });
  };
  async function CallAgain() {
    if (current?.id) {
      new Audio("/waitingque.mp3").play();
      const docRef = doc(db, "queue", current.id);
      await updateDoc(docRef, {
        callCount: current.callCount + 1,
        updatedAt: new Date(),
      });
    }
  }
  async function NextQueue() {
    let timerInterval: any;
    Swal.fire({
      icon: "success",
      title: "Next Queue",
      html: "Auto close in <b></b> secconds",
      timer: 2000,
      timerProgressBar: true,
      didOpen: async () => {
        if (current?.id) {
          Swal.showLoading();
          new Audio("/nextqueue.mp3").play();
          const timer: any = Swal.getPopup()?.querySelector("b");
          timerInterval = setInterval(() => {
            timer.textContent = `${Math.floor((Swal.getTimerLeft() || 0) / 1000) + 1}`;
          }, 100);
          const docRef = doc(db, "queue", current.id);
          await updateDoc(docRef, {
            deletedAt: new Date(),
            updatedAt: new Date(),
          });
        }
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        // console.log("I was closed by the timer");
      }
    });
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="min-w-[500px] w-2/4 min-h-[400px] h-2/4 border-2 rounded-md border-gray-500 ">
        <div className="flex justify-center items-center p-4">
          <p className="text-3xl text-zinc-300">Queue System</p>
        </div>
        <div className="flex justify-between items-center ">
          <div className="px-5 text-blue-500 text-2xl">ON QUEUE</div>
          <div className="px-5 text-emerald-500 text-2xl">SERVED</div>
        </div>
        <div className="flex justify-between items-center ">
          <div className="pl-[75px] text-blue-500 text-2xl">{queue}</div>
          <div className="pr-[60px] text-emerald-500 text-2xl">{queueServed}</div>
        </div>
        <div className="flex justify-center items-center text-4xl font-bold text-gray-700 mt-3">NOW SERVING</div>
        <div className="flex justify-center items-center mt-3">
          {current?.queue ? (
            <>
              <p className="text-5xl font-bold text-red-500">{`Q-${String(current?.queue).padStart(2, "0")}`}</p>
            </>
          ) : (
            <>No Queue</>
          )}
        </div>
        {current?.queue ? (
          <>
            <div className="flex justify-center items-center text-2xl pt-3 text-gray-700">{current.callCount} TIME(S)</div>
          </>
        ) : (
          <></>
        )}
        <div className="flex justify-center items-center">
          <Btn
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-phone-call"
              >
                <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            }
            className="mt-12 bg-gray-500 text-white hover:bg-gray-400 px-2 mx-2"
            name="Call Again"
            onClick={CallAgain}
          ></Btn>
          <Btn
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-player-track-next"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M3 5v14l8 -7z" /> <path d="M14 5v14l8 -7z" />{" "}
              </svg>
            }
            className="mt-12 bg-blue-500 text-white hover:bg-blue-400 px-2 mx-2"
            name="Next Queue"
            onClick={NextQueue}
          ></Btn>
        </div>
      </div>
    </div>
  );
}
