"use client";

import Btn from "@/components/Btn";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";
import { db } from "@/plugins/firebase";
import { generateQR } from "@/utils/qrcode";
import Image from "next/image";

export default function NewQueue() {
  const [lastQueue, setLastQueue] = useState<Queue>({
    queue: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    callCount: 0,
  });
  const [qrCodeSrc, setQrCodeSrc] = useState<string | undefined>();
  useEffect(() => {
    fetchQueue();
  }, []);
  async function AddQueue() {
    let timerInterval: any;
    Swal.fire({
      icon: "success",
      title: "Queue Added",
      html: "Auto close in <b></b> secconds",
      timer: 1000,
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
    fetchQueue();
    const newQ = await addDoc(collection(db, "queue"), {
      queue: lastQueue.queue + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      callCount: 0,
    });
    const src = await generateQR(`${process.env.URL_CHECK_QUEUE}${newQ.id}`);
    setQrCodeSrc(src);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="min-w-[500px] w-2/4 min-h-[400px] h-2/4 border-2 rounded-md border-gray-500 flex flex-col justify-center items-center">
        <p>กรุณากดปุ่ม "Add Queue" บนหน้าจอ เพื่อจองคิว + Generate Qrcode </p>
        <Btn className="mt-12 bg-yellow-500 text-white hover:bg-yellow-400" name="Generate Qrcode" onClick={AddQueue}></Btn>

        {qrCodeSrc ? (
          <>
            <Image src={qrCodeSrc} width={200} height={200} alt="qrcode" />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
