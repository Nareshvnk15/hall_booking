const express = require("express");
const HTTP_SERVER = express();
const PORT = 3000;
const HOSTNAME = "localhost";

HTTP_SERVER.listen(PORT,HOSTNAME,1,()=>{
    console.log(`app started at http://${HOSTNAME}:${PORT}`);
});

let rooms=[ ];
let bookings=[ ];
let bookingIdcounter=[ ];



HTTP_SERVER.post('/rooms',(req,res)=>{
    const {name,seats,amenities,priceperhour}=req.body;
    const newroom={
        id:rooms.length+1,name,seats,amenities,priceperhour,bookings:[],
    };
    rooms.push(newroom);
    res.status(201).json(newroom);
});


HTTP_SERVER.post('/bookings',(req,res)=>{
    const{customerName,date,starttime,endtime,roomId}=req.body;

    const room = rooms.find(rooms => room.id === room.Id);
    if(!room){
        return res.status(404).json({mesage:"ROOM NOT FOUND TRY ANOTHER"});
    }

    const isbooked= room.bookings.some(booking =>
        booking.date === date && ((starttime >= booking.starttime && starttime < booking.endtime)
                                   (endtime > booking.starttime && endtime <= booking.endtime))
    );
    if(isbooked){
        return res.status(400).json({message:"ROOM IS ALREADY BOOKED"});
    }

    const newbooking={
        bookingId:bookingIdcounter++,
        customerName,
        date,
        starttime,
        endtime,
        roomId,
        bookingdate: new Date(),
        bookingStatus: 'BOOKING CONFIRMED'
    };

    room.bookings.push(newbooking);
    bookings.push(newbooking);
    res.status(201).json(newbooking);
    
});


HTTP_SERVER.get('/customer',(req,res) => {
    const customerbookings = bookings.map(booking =>({
        customerName: booking.customerName,
        roomName: rooms.find(room => room.id === booking.roomId).name,
        date: booking.date,
        starttime: booking.starttime,
        endtime: booking.endtime,
    }));
    res.status(200).json(customerbookings);
});


HTTP_SERVER.get('/customer-bookings/:customerName',(req,res) => {
    const customerName = req.params.customerName;
    const customerbookings = bookings.filter(booking => booking.customerName === customerName)
                                     .map(booking => ({
                                        customerName: booking.customerName,
                                        roomName: rooms.find(room => room.id === booking.roomId).name,
                                        date: booking.date,
                                        endtime: booking.endtime,
                                        bookingId: booking.bookingId,
                                        bookingdate: booking.bookingdate,
                                        bookingStatus: booking.bookingStatus,
                                     }));
                                     res.status(200).json(customerbookings);
    
});