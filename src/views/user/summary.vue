<template>
    <div class="user_summary">
        <div class="">
            <img class="avatar" v-if="!user.avatar" src="/static/images/avatar_default_b.png" />
            <img class="avatar" v-else :src="user.avatar | cdn_img" />
        </div>
        <div style="" class="h6 name">{{user.name}}</div>
        <hr />
        <div class="card-body" v-if="user.profile">
            <div>
                <small class="text-muted">手机号</small>
                <div class="h6">{{user.mobile || '-'}}</div>
            </div>
            <div>
                <small class="text-muted">员工号</small>
                <div class="h6" v-if="user.profile">{{user.profile.employee_id || '-'}}</div>
                <div class="h6" v-else>-</div>
            </div>
            <div>
                <small class="text-muted">组织机构</small>
                <div class="h6" v-if="user.profile">{{user.profile.orgCode}} </div>
            </div>
            <div>
                <small class="text-muted">在职岗位</small>
                <div class="h6">{{user.profile.postText}} </div>
            </div>
            <div>
                <small class="text-muted">创建时间</small>
                <div class="h6">{{user.created_at}} </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: {
        user: {
            default: {

            },
            required: true,
        },
    },
    watch: {
        user(newVal) {
            this.user = newVal;
        },
    },
}
</script>

<style lang="scss" scoped type="text/css">
.user_summary {
    .avatar {
        max-width: 120px;
        max-height: 120px;
        display: block;
        margin: 0 auto;
    }
    .card-body {
        -webkit-box-flex: 1;
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
        padding: 1.25rem;
    }
    .text-muted {
        color: #6c757d!important;
    }
    .name {
        text-align:center;
        margin-top: 20px;
    }
}
</style>

<style lang="scss">
.h6 {
    font-size: 1rem;
}
</style>




