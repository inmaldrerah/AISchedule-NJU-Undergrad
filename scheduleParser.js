function scheduleHtmlParser(html) {
    //除函数名外都可编辑
    //传入的参数为上一步函数获取到的html
    //可使用正则匹配
    //可使用解析dom匹配，工具内置了$，跟jquery使用方法一样，直接用就可以了，参考：https://juejin.im/post/5ea131f76fb9a03c8122d6b9
    //以下为示例，您可以完全重写或在此基础上更改
    let rows = $(html).find("tr")
    let result = rows.map((_, row) => parseCourse(row.children)).filter((_, map) => map != undefined).toArray()
    result = removeConflict(result)

    return result
}

function parseCourse(row) {
    const WEEK_MAX = 20
    let lesson = $(row[7]).text().trim().split(" ")
    if (lesson.length < 4 || lesson[0] == "自由时间") { return undefined }
    return {
        name: $(row[3]).text(),
        teacher: parseTeacher($(row[5]).text()),
        day: parseDayOfWeek(lesson[1]),
        sections: parseSections(lesson[2]),
        weeks: parseWeeks(lesson[0]),
        position: parsePosition(lesson[3])
    }
}

function countUtf8Bytes(s) {
    let b = 0, i = 0, c
    for(; c=s.charCodeAt(i++); b += c>>11 ? 3 : c>>7 ? 2 : 1);
    return b
}

function parseTeacher(teacher) {
    teacher = teacher.trim().replace(/，/g, ",")
    while (countUtf8Bytes(teacher) > 19) {
        teacher = teacher.slice(0, teacher.lastIndexOf(",")) + " 等"
    }
    return teacher
}

function parseDayOfWeek(day) {
    switch (day) {
        case "星期一":
            return 1
        case "星期二":
            return 2
        case "星期三":
            return 3
        case "星期四":
            return 4
        case "星期五":
            return 5
        case "星期六":
            return 6
        case "星期日":
            return 7
        default:
            return 0
    }
}

function parseSections(range) {
    sections = []
    range = range.split("-").map((s) => Number(s.slice(1, -1)))
    for (let a = range[0]; a <= range[1]; a++) {
        sections.push({ section: a })
    }
    return sections
}

function parseWeeks(weekExpr) {
    weeks = []
    if (weekExpr == "单周") {
        let week_start = 1
        for (let a = week_start; a <= WEEK_MAX; a += 2) {
            weeks.push(a)
        }
    } else if (weekExpr == "双周") {
        let week_start = 2
        for (let a = week_start; a <= WEEK_MAX; a += 2) {
            weeks.push(a)
        }
    } else if (weekExpr.indexOf("-") != -1) {
        weekRange = weekExpr.slice(0, -1).split("-").map(Number)
        for (let a = weekRange[0]; a <= weekRange[1]; a++) {
            weeks.push(a)
        }
    } else {
        weeks = weekExpr.split(",").map((s) => Number(s.slice(0, -1)))
    }
    return weeks
}

function parsePosition(position) {
    position = position.trim().replace(/，/g, ",")
    while (countUtf8Bytes(position) > 19) {
        position = position.slice(0, position.lastIndexOf(",")) + "等"
    }
    return position
}

function removeConflict(courses) {
    let schedule = new Map()
    let tmpcourses = JSON.parse(JSON.stringify(courses))
    for (let i = 0; i < courses.length; i++) {
        for (let j = 0; j < courses[i].weeks.length; j++) {
            for (let k = 0; k < courses[i].sections.length; k++) {
                let key = JSON.stringify([courses[i].weeks[j], courses[i].day, courses[i].sections[k].section])
                if (schedule.has(key)) {
                    let conflictingCourse = schedule.get(key)
                    let index = tmpcourses[conflictingCourse].weeks.findIndex((value)=>{ return value == courses[i].weeks[j] })
                    if (index != -1) {
                        tmpcourses[conflictingCourse].weeks.splice(index, 1)
                        tmpcourses.push({
                            name: "课程冲突",
                            weeks: [
                                courses[i].weeks[j]
                            ],
                            sections: courses[i].sections,
                            day: courses[i].day,
                            teacher: "",
                            position: ""
                        })
                    }
                    index = tmpcourses[i].weeks.findIndex((value)=>{ return value == courses[i].weeks[j] })
                    if (index != -1) {
                        tmpcourses[i].weeks.splice(index, 1)
                    }
                } else {
                    schedule.set(key, i)
                }
            }
        }
    }
    return tmpcourses.filter(course => course.weeks.length > 0 && course.day > 0)
}