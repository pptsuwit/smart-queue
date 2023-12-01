"use client";

import Btn from "@/app/components/Btn";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { collection, addDoc, query, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/plugins/firebase";

export default function NewQueue() {
  const [lastQueue, setLastQueue] = useState<Queue>({
    queue: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    callCount: 0,
  });
  useEffect(() => {
    fetchQueue();
  }, []);
  function AddQueue() {
    let timerInterval: any;
    Swal.fire({
      icon: "success",
      title: "Queue Added",
      html: "Auto close in <b></b> secconds",
      timer: 3000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        // new Audio("/quesuccess.mp3").play();
        new Audio("/waitingque.mp3").play();
        insertQueue();
        const timer: any = Swal.getPopup()?.querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Math.floor((Swal.getTimerLeft() || 0) / 1000) + 1}`;
        }, 100);
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
  const fetchQueue = () => {
    const q = query(collection(db, "queue"));

    onSnapshot(q, (querySnapshot) => {
      let items: any = [];

      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      if (items.length > 0) {
        setLastQueue({
          queue: items.length,
          createdAt: items.createdAt,
          updatedAt: items.updatedAt,
          deletedAt: null,
          callCount: items.callCount,
        });
      }
    });
  };

  const insertQueue = async () => {
    await addDoc(collection(db, "queue"), {
      queue: lastQueue.queue + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      callCount: 0,
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="min-w-[500px] w-2/4 min-h-[300px] h-2/4 border-2 rounded-md border-gray-500 flex flex-col justify-center items-center">
        <p>กรุณากดปุ่ม "Add Queue" บนหน้าจอ เพื่อจองคิว</p>
        <Btn className="mt-12 bg-blue-500 text-white hover:bg-blue-400" name="Add Queue" onClick={AddQueue}></Btn>
      </div>
    </div>
  );
}
