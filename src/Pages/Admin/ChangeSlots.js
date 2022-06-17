import { CenterFocusWeakSharp } from "@mui/icons-material";
import { Box, Container, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingsCard from "../../Component/Admin/BookingsCard";
import { db } from "../../firebase";
import firebase from 'firebase/app';
import "../../Styles/AllBookings.css";


const ChangeSlots = () => {
  const navigation = useNavigate();
  const auth = firebase.auth();
  const user = auth.currentUser?.uid;

  const [data, setData] = useState([]);

  useEffect(() => {
    let addData = [];
    if(user === '60UCDF2biAdLsbVtPodocfaUqby2') {
      db.collection("CancelledBookings")
        .orderBy("timestamp", "desc")
        .onSnapshot((e) => {
          e.docs.map((doc) => addData.push({ ...doc.data(), id: doc.id }))
          setData(addData)

        });
    } else {
      setData([])
    }
  }, [navigation]);

  console.log("ALLLBOOKING---", user)

  return (
    <Container flex="1" mt="10" width={"100vw"} p="4">
      <Box shadow={8} width={"80vw"} p="5" className="glassHead">
        <Text fontSize="xl">Cancel Bookings</Text>
      </Box>
      {data.length > 0 ? (
        data.map((item) => <BookingsCard data={item} key={data?.id} />)
      ) : (
        <Text fontSize="3xl" color={"danger.500"}>
          No Bookings Found
        </Text>
      )}
    </Container>
  );
};

export default ChangeSlots;
