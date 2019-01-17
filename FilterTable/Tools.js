const tool = {
    // 处理专业下拉选回显
    dealDisciplineReshow(discilpine, dict) {
        // 取出专业ids数组
        let str = discilpine;
        let arr = [];
        if (str && str !== '' && str !== null) {
            if (str.indexOf(',') !== -1) {
                arr = str.split(',')
            } else {
                arr.push(str)
            }
        }
        let goalDict = [];
        // 返回完整字典
        let codearr = dict.map(ele => ele.id);
        arr.map((j, indexJ) => {
            codearr.map((k, indexK) => {
                if (j == k) {
                    goalDict.push(k)
                }
            })
        })
        console.log(goalDict)
        return goalDict
    },
    // 处理专业数据字典
    dealDisc(str, arr) {
        if (str !== '' && str && str != null) {
            if (str.indexOf(",") != -1) {
                let Code = str.split(',')
                let codear = arr.map(ele => ele.id);
                let Name = [];
                Code.map(code => {
                    codear.map((ele, index) => {
                        if (ele == code) {
                            Name.push(arr[index].disciplineName);
                        }
                    })
                })
                console.log(Name)
                return Name.join(',');
            } else {
                let Code = str;
                let codear = arr.map(ele => ele.id);
                let Name = [];
                codear.map((ele, index) => {
                    if (ele == Code) {
                        Name.push(arr[index].disciplineName);
                    }
                })
                console.log(Name)
                return Name[0];
            }
        } else {
            return null
        }
    },
    // 处理 数据字典回显
    dealSelectDict(Code, arr, label, value) {
        let codear = arr.map(ele => ele[label]);
        let Name;
        codear.map((ele, index) => {
            if (ele == Code) {
                Name = arr[index][value];
            }
        })
        console.log(Name)
        return Name;
    },
    // 处理新增参数
    dealParameter(arr) {
        let newar = [];
        arr.map(ele => {
            let obj = {};
            obj.id = ele.id;
            obj.permissionType = ele.permissionType;
            obj.roleCode = ele.roleCode;
            obj.disciplineId = ele.disciplineId !== '' && ele.disciplineId !== null && ele.disciplineId.length > 0 ? ele.disciplineId.join(',') : null;
            obj.authorityDescription = ele.authorityDescription;
            obj.authorityStatus = ele.authorityStatus == true ? 0 : 1;
            obj.libId = this.libId;
            newar.push(obj)
        })
        return newar
    },
    // 处理过滤参数
    dealFilterParam(ele) {
        let newar = [];
        let obj = {};
        obj.permissionType = ele.permissionType;
        obj.roleCode = ele.roleCode;
        if (ele.disciplineIds) {
            obj.disciplineId = ele.disciplineIds !== '' && ele.disciplineIds !== null && ele.disciplineIds.length > 0 ? ele.disciplineIds.join(',') : null;
        } else {
            obj.disciplineId = ele.disciplineId;
        }
        obj.authorityDescription = ele.authorityDescription;
        obj.authorityStatus = ele.authorityStatus != undefined ? ele.authorityStatus : null;
        obj.defUserName = ele.defUserName;
        obj.updUserName = ele.updUserName;
        let defDtArr = ele.defDt == null ? [null, null] : ele.defDt;
        let updDtArr = ele.updDt == null ? [null, null] : ele.updDt;
        obj.defDtBegin = defDtArr[0];
        obj.defDtEnd = defDtArr[1];
        obj.updDtBegin = updDtArr[0];
        obj.updDtEnd = updDtArr[1];
        obj.defDt = null;
        obj.updDt = null;
        obj.libId = this.libId;
        obj.page = this.pageAble.page;
        obj.size = this.pageAble.size;
        for (const key in obj) {
            if (obj[key] == null) {
                delete obj[key]
            }
        }
        // newar.push(obj)
        console.log(obj)
        return obj
    },
    // 处理id参数
    dealIdparam() {
        let arr = [];
        let ids = this.selectionArr.map(ele => ele.id);
        ids.forEach(ele => {
            let obj = {};
            obj.id = ele;
            arr.push(obj)
        })
        return arr
    },
    // 数组对象深拷贝
    deepCopyObjArray(arr) {
        let newArr = new Array(arr.length);
        arr.map((item, index) => {
            let obj = {};
            for (const key in item) {
                obj[key] = item[key];
            }
            newArr[index] = obj;
        })
        return newArr
    },
    // 对象深拷贝
    deepCopyObject(obj) {
        let newobj = {};
        for (const key in obj) {
            newobj[key] = obj[key];
        }
        return newobj
    }
}
export default tool