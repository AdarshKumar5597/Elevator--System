"use client";
import React, { useState, useEffect } from "react";


function createElevator(id, currentFloor) {
  return {
    id: id,
    currentFloor: currentFloor,
    direction: 0, 
    destination: null,
  };
}

function moveElevator(elevator) {
  if (elevator.direction === 1 && elevator.currentFloor < 11) {
    return { ...elevator, currentFloor: elevator.currentFloor + 1 };
  } else if (elevator.direction === -1 && elevator.currentFloor > 0) {
    return { ...elevator, currentFloor: elevator.currentFloor - 1 };
  } else {
    return { ...elevator, direction: 0, destination: null };
  }
}

function setElevatorDestination(elevator, destination) {
  if (destination > elevator.currentFloor) {
    return { ...elevator, direction: 1, destination: destination };
  } else if (destination < elevator.currentFloor) {
    return { ...elevator, direction: -1, destination: destination };
  } else {
    return { ...elevator, direction: 0, destination: null };
  }
}

function createElevatorSystem() {
  const elevators = [
    createElevator(1, 0),
    createElevator(2, 5),
    createElevator(3, 10),
  ];
  const floorRequests = Array(11).fill([]);

  return { elevators, floorRequests };
}

function requestElevator(elevatorSystem, floor) {
    let nearestElevator = elevatorSystem.elevators[0];
    let nearestDistance = Math.abs(nearestElevator.currentFloor - floor);
    console.log(`nearestDistance: ${nearestDistance}`)
  
    for (const elevator of elevatorSystem.elevators) {
      if (elevator.destination === null) {
        const distance = Math.abs(elevator.currentFloor - floor);
        if (distance < nearestDistance) { 
          nearestElevator = elevator;
          nearestDistance = distance;
        }
      }
    }
  
    const updatedElevator = setElevatorDestination(nearestElevator, floor);
    return {
      ...elevatorSystem,
      elevators: elevatorSystem.elevators.map(elevator =>
        elevator.id === updatedElevator.id ? updatedElevator : elevator
      )
    };
  }
  

function updateElevatorSystem(elevatorSystem) {
  const updatedElevators = elevatorSystem.elevators.map((elevator) => {
    if (elevator.destination !== null) {
      const updatedElevator = moveElevator(elevator);
      if (updatedElevator.currentFloor === elevator.destination) {
        return setElevatorDestination(updatedElevator, null);
      } else {
        return updatedElevator;
      }
    } else {
      return elevator;
    }
  });

  return { ...elevatorSystem, elevators: updatedElevators };
}

function ElevatorSystemApp() {
  const [elevatorSystem, setElevatorSystem] = useState(createElevatorSystem());

  useEffect(() => {
    const interval = setInterval(() => {
      setElevatorSystem((prevElevatorSystem) =>
        updateElevatorSystem(prevElevatorSystem)
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);


  const handleButtonClick = (floor) => {
    setElevatorSystem((prevElevatorSystem) =>
      requestElevator(prevElevatorSystem, floor - 1)
    );
  };

  function FloorButton({ floor }) {
    return (
      <button
        className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 mr-2"
        onClick={() => handleButtonClick(floor)}
      >
        {floor}
      </button>
    );
  }

  return (
    <div className="container flex justify-evenly">
      <h1 className="text-5xl font-bold my-auto">Elevator System</h1>
      <div id="status" className="p-5 h-full my-auto">
        <p className="font-bold p-2">{`Set Floor-(Upto 3 Elevator)`}</p>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((floor) => (
          <div key={floor} className="flex justify-center mb-2">
            <FloorButton floor={floor} />
          </div>
        ))}
      </div>

      <div className=" h-[99vh] w-[30vw] bg-red-500 flex justify-between items-end building">
        {elevatorSystem.elevators.map((elevator) => (
          <div
            key={elevator.id}
            className={`w-[30vw] h-[9vh] border-black border border-2px flex justify-center items-center flex-col text-sm elevator`}
            style={{ marginBottom: `${elevator.currentFloor * 9}vh`, transitionTimingFunction: "linear", transitionProperty: "margin-bottom", transitionDuration: "2s"}}
          >
            <p className="">{`Floor ${elevator.currentFloor + 1}`}</p>
            <p>
              {elevator.destination
                ? `Destination: ${elevator.destination + 1}`
                : "Destination: None"}
            </p>
            <p>
              {elevator.direction === 1
                ? "Direction: Up"
                : elevator.direction === -1
                ? "Direction: Down"
                : "Direction: Idle"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ElevatorSystemApp;
