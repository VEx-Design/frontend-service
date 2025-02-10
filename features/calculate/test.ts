import {evaluate} from "mathjs"
import { createConfiguration, createEdge, createType, createVariable, createVertex, Graph, evaluateGraph, freespaceInEdge } from "./graph";
import { create } from "lodash";

let types = [
    createType("start","start",[],0,1)
    ,createType("end","end",[],1,0)
    ,createType("1","Lens",[createVariable("focal length","f")],1,1)
    ,createType("2","Beam Spliter",[createVariable("transmission","t"),createVariable("reflected","r")],1,2)
    ,createType("3","Combinator",[],2,1)
]

let configuration = createConfiguration(
    "1",
    ["x","theta"],
    {"1":[{
        "x":"x",
        "theta":"((-1)*x/f) + theta"
    }],
     "2":[{
        "x":"x*t",
        "theta":"theta"
     },
     {"x":"x*r",
        "theta":"theta"
     }],
     "3":[{
        "x":"x_1 + x_2",
        "theta":"theta_1 + theta_2"
     }]
    },
    {"x":"x + (distance*theta)",
        "theta":"theta"
    }
)

let g : Graph = {
    vertices:[
        createVertex("1","start",{},[{x:25,theta:1}]),
        createVertex("2","1",{"f":15},[]),
        createVertex("3","2",{"t":75,"r":25},[]),
        createVertex("4","1",{"f":15},[]),
        createVertex("5","end",{},[]),
        createVertex("6","1",{"f":15},[]),
        createVertex("7","end",{},[])
    ]
    ,edges:[
        createEdge("1","2",1,1,25),
        createEdge("2","3",1,1,25),
        createEdge("3","4",1,1,25),
        createEdge("4","5",1,1,25),
        createEdge("3","6",2,1,25),
        createEdge("6","7",1,1,25)
    ]
}

let g2 : Graph = {
    vertices:[
        createVertex("1","start",{},[{x:25,theta:0}]),
        createVertex("2","start",{},[{x:25,theta:0}]),
        createVertex("3","3",{},[]),
        createVertex("4","end",{},[])
    ]
    ,edges:[
        createEdge("1","3",1,1,25),
        createEdge("2","3",1,2,25),
        createEdge("3","4",1,1,25),
    ]
}

let g3: Graph = {
    vertices:[
        createVertex("1","start",{},[{x:25,theta:0}]),
        createVertex("2","start",{},[{x:25,theta:0}]),
        createVertex("3","1",{"f":15},[]),
        createVertex("4","end",{},[]),
        createVertex("5","1",{"f":15},[]),
        createVertex("6","end",{},[])
    ]
    ,edges:[
        createEdge("1","3",1,1,25),
        createEdge("3","4",1,1,25),
        createEdge("2","5",1,1,25),
        createEdge("5","6",1,1,25),
    ]
}

console.log(evaluateGraph(g3,types,configuration))
console.log(freespaceInEdge(g3.edges[1],20,g3,configuration))