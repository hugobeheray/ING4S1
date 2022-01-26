//
// Database: company.js
//
// Write the MongoDB queries that return the information below. Find as many solutions as possible for each query.
//

print("Query 01")
// the highest salary of clerks
db.emp.aggregate([
    {$match: { job: 'clerk'}},
    {
        $group:{
            _id:null,
            name:{ "$first": "$name" },
            max: {$max: "$salary"}
        }
    }
])
print("Query 02")
// the total salary of managers
db.emp.aggregate([
    {$match: { job: 'manager'}},
    {
        $group:{
            _id:null,
            total : {$sum: "$salary"}
        }
    }
])
print("Query 03")
// the lowest, average and highest salary of the employees
db.emp.aggregate([
    {
        $group:{
            _id:null,
            max: {$max: "$salary"},
            avg: {$avg: "$salary"},
            min: {$min: "$salary"}
        }
    }
])
print("Query 04")
// the name of the departments
db.emp.aggregate([
    { $match: {"department.name": {$ne: null}}},
    {
        $group:{
            _id:"$department.name",
        },
    }
])
print("Query 05")
// for each job: the job and the average salary for that job
db.emp.aggregate([
    {
        $group:{
            _id:"$job",
            avg:{
                $avg: "$salary"
            }
        },
    }
])
print("Query 06")
// for each department: its name, the number of employees and the average salary in that department (null departments excluded)
db.emp.aggregate([
    { $match: {"department.name": {$ne: null}}},
    {
        $group:{
            _id:"$department.name",
            avg:{
                $avg: "$salary"
            },
            sum:{$sum:1}
        },
    }
])
print("Query 07")
// the highest of the per-department average salary (null departments excluded)
db.emp.aggregate([
    { $match: {"department.name": {$ne: null}}},
    {
        $group:{
            _id:"$department.name",
            avg:{
                $avg: "$salary"
            }
        }
    },
    { $group:{
        _id:null, name:{"$first": "$_id"}, highest: {$max:"$avg"}
    }}
])
print("Query 08")
// the name of the departments with at least 5 employees (null departments excluded)
db.emp.aggregate([
    { $match: {"department.name": {$ne: null}}},
    {
        $project:{
            emp: "$name",
            dept: "$department.name"
        }
    },
    {
        $group:{
            _id:"$dept",
            sum: {$sum:1}
        }
    },
    {
        $match:{sum: {$gte: 5}}
    }
])
print("Query 09")
// the cities where at least 2 missions took place
db.emp.aggregate([
    { $unwind: "$missions"},
    {
        $group:{
            _id: "$missions.location",
            sum: {$sum:1}
        }
    },
    {
        $match:{sum:{$gte:2}}
    }
])
print("Query 10")
// the highest salary
db.emp.aggregate([
    {
        $group:{
            _id: null,
            max: {$max:"$salary"}
        }
    }
])
print("Query 11")
// the name of _one_ of the employees with the highest salary
db.emp.aggregate([
    {
        $group:{
            _id: null,
            max: {$max:"$salary"},
            name:{"$first":"$name"}
        }
    },
    {
        $project:{ _id: 1, name:1}
    }
])
print("Query 12")
// the name of _all_ of the employees with the highest salary
db.emp.aggregate([
{
    $group: {
        _id: null,
        max: {
            $max: "$salary"
        },
        empgrp: {
            $push: {
                nom: "$name",
                salary:"$salary"
            }
        }
    }
},
{
    $project: {
        _id: 0,
        toppers: {
            $setDifference: [{
                    $map: {
                        input: "$empgrp",
                        as: "emp",
                        in: {
                            $cond: [{
                                    $eq: ["$max", "$$emp.salary"]
                                },
                                "$$emp",
                                false
                            ]
                        }
                    }
                },
                [false]
            ]
        }
 
    }
},{
    $project: {
        name: "$toppers.nom"
    }
}])
print("Query 13")
// the name of the departments with the highest average salary
db.emp.aggregate([
    { $match: {"department.name": {$ne: null}}},
    {
        $group:{
            _id:"$department.name",
            avg:{
                $avg: "$salary"
            }
        },
    },
    {
        $group: {
            _id: null,
            max:{
                $max:"$avg"
            },
            dept: {
                $push: {
                    nom: "$_id",
                    avg:"$avg"
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            toppers: {
                $setDifference: [{
                        $map: {
                            input: "$dept",
                            as: "dept",
                            in: {
                                $cond: [{
                                        $eq: ["$max", "$$dept.avg"]
                                    },
                                    "$$dept",
                                    false
                                ]
                            }
                        }
                    },
                    [false]
                ]
            }
     
        }
    },{
        $project: {
            name: "$toppers.nom"
        }
    }
])
print("Query 14")
// for each city in which a mission took place, its name (output field "city") and the number of missions in that city
db.emp.aggregate([
    { $unwind: "$missions"},
    { $match: {"missions.location": {$ne: null}}},
    {
        $group:{
            _id:"$missions.location",
            sum: {$sum:1}
        }
    },
    {
        $project:{
            city:"$_id", _id:0
        }
    }
])
print("Query 15")
// the name of the employees who did a mission in the city they work in
db.emp.aggregate([
    { $unwind: "$missions"},
    { $match: {"missions.location": {$ne: null}, "department.location":{$ne:null}}},
    {
        $group: {
            _id: null,
            data: {
                $push: {
                    _id: "$_id",
                    nom: "$name",
                    dept: "$department.location",
                    missions: "$missions.location"
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            toppers: {
                $setDifference: [{
                        $map: {
                            input: "$data",
                            as: "data",
                            in: {
                                $cond: [{
                                        $eq: ["$$data.dept", "$$data.missions"]
                                    },
                                    "$$data",
                                    false
                                ]
                            }
                        }
                    },
                    [false]
                ]
            }
     
        }
    },
    {
        $project:{
            nom:"$toppers.nom"
        }
    }
])



