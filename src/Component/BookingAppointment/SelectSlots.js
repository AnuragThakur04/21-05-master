import { Box, Button, Center, Divider, Heading, HStack, Pressable, Text, VStack, } from "native-base";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import BookingsScheduler from "../Admin/BookingsScheduler";

const SelectSlots = ({ data, setData, close }) => {
  const navigation = useNavigate();
  const [tslots, setTslots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const  [cancelBooking, setCancelBooking] = useState([]);
  useEffect(() => {
    if (data.time) {
      setSelectedTime(data.time)
    }
    timeSlots();
    const alreadyBookedSlots = [];

    db.collection("CancelledBookings").onSnapshot((e) => {
      
      e.docs.forEach((doc) => { 
        if(data && data.date.getTime() === doc.data().bookedDate) {
          alreadyBookedSlots.push(doc.data().bookedTime)
          console.log("Time", doc.data().bookedTime)
        }
      })
      console.log("AlreadyBooked", alreadyBookedSlots)

      setCancelBooking(alreadyBookedSlots)
    });

    // console.log("CancelledSlots", alreadyBookedSlots)
    let docs = [];
    db.collection("Bookings").onSnapshot((e) => {
      e.docs.forEach((doc) => { 
        console.log("Check", data.date.getTime(), doc.data().bookedDate, data.date.getTime() === doc.data().bookedDate)

        if(data && data.date.getTime() === doc.data().bookedDate) {
          alreadyBookedSlots.push(doc.data().bookedTime)
        }

      })

      setBookedSlots(alreadyBookedSlots)

    });


  }, [navigation, data]);


  const timeSlots = () => {
    var x = {
      nextSlot: 30,
      startTime: "10:00",
      endTime: "17:00",
    };
    var slotTime = moment(x.startTime, "HH:mm");
    var endTime = moment(x.endTime, "HH:mm");
    let times = [];
    while (slotTime < endTime) {
      let temp = {
        start: "",
        end: "",
        id:''
      };
      temp.start = slotTime.format("hh:mm a");
      slotTime = slotTime.add(x.nextSlot, "minutes");
      temp.end = slotTime.format("hh:mm a");
      temp.id=slotTime.format("hh:mm a").toString()
      times.push(temp);
    }
    setTslots(times);
  };
  return (
    <VStack flex="1" bg="#fff" h="80%">
      <Center p="2">
        <Heading>Choose Suitable Slot</Heading>
      </Center>
      <HStack
        space="2"
        p="2"
        my="5"
        w="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Box shadow="5" w="40%" borderRadius="5" alignItems="center" justifyContent='center'
          h='full'>
          <Text fontSize="lg"
            bg="teal.500"
            w="100%"
            textAlign="center"
            color="#fff"
            fontWeight="bold">Choose Date</Text>
          <BookingsScheduler value={data.date} onChange={e => setData({ ...data, date: e })} />
        </Box>
        <Box
          shadow="5"
          w="40%"
          h='full'
          borderRadius="5"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text
            fontSize="lg"
            bg="teal.500"
            w="100%"
            textAlign="center"
            color="#fff"
            fontWeight="bold"
          >
            Available Time Slots
          </Text>
          <Box
            flexWrap="wrap"
            flexDirection="row"
            alignItems="center"
            m="2"
            justifyContent="center"
          >
            {tslots &&
              tslots.filter(res =>
                {
                  const isSlotBooked = [...cancelBooking,...bookedSlots].findIndex((bookedS) => {
                    return bookedS.id === res.id;
                  })
                  // const temp=bookedSlots.map(e=>{
                  //   if(res?.id !== e?.id) {
                  //     return res
                  //   }
                  // })
                  // if(temp[0]?.id===res?.id) return res
                  // if(bookedSlots.length===0) return res

                  if(isSlotBooked >= 0)
                  {
                    return false
                  }
                  return true
                })
              .map((item, i) => (
                <Pressable
                  key={i}
                  w="1\3"
                  h="12"
                  borderRadius="10"
                  borderWidth="1"
                  borderColor="#c8c8c8"
                  m="1"
                  alignItems="center"
                  justifyContent="center"
                  p="2"
                  onPress={() => {
                    !selectedTime
                      ? setSelectedTime(item)
                      : setSelectedTime(null);

                    setData({ ...data, time: item })
                  }}
                  bg={
                    selectedTime
                      ? selectedTime.start === item.start &&
                      selectedTime.end === item.end &&
                      "teal.500"
                      : "#fff"
                  }
                >
                  <Text>
                    {item?.start}-{item?.end}
                  </Text>
                </Pressable>
              ))}
          </Box>
        </Box>
      </HStack>
      <Button w="20%" alignSelf="center" colorScheme="success" onPress={close} >
        Confirm
      </Button>
    </VStack>
  );
};

export default SelectSlots;
