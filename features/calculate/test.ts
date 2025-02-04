import {evaluate} from "mathjs"
import { createConfiguration, createEdge, createType, createVariable, createVertex, Graph, tSort,calculate } from "./graph";

let g: Graph ={
    vertices:[
        createVertex("1","start",{},[{"r": 10,"theta": 0}]),
        createVertex("2","1",{"f" : -50},[]),
        createVertex("3","end",{},[])
    ],
    edges: [
        createEdge("1","2",25,false),
        createEdge("2","3",50,false)
    ]
}

let g2: Graph ={
    vertices:[
        createVertex("1","start",{},[{"r": 10,"theta": -0.1}]),
        createVertex("3","end",{},[])
    ],
    edges: [
        createEdge("1","3",25,false),
    ]
}

let lens = createType("1","Lens",[createVariable("focal length","f")],1,1)

let config = createConfiguration("1",["r","theta"],
    {
        "1":[{"r": "r","theta": "((-1) * r / f) + theta"}],
    },
    {"r": "r+ (distance)*theta","theta": "theta"}
);

console.log(calculate(g,config))