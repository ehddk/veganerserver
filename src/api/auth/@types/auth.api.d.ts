type IAuth = {
  role?: RoleType;
  salt?: string;
  id: string;
  email: string;
  name: string;
  password?: string;
};

/**조회 */

type getMemberRequestPath = { id: string };
type getMemberRequestParams = {};
type getMemberRequestBody = {};

type getMemberRequest = {
  path: getMemberRequestPath;
  params?: getMemberRequestParams;
  body?: getMemberRequestBody;
};
type getMemberResponse = IAuth;

/**생성 */
type createMemberRequestPath = {};
type createMemberRequestParams = {};
type createMemberRequestBody = {
  email: string;
  name: string;
  password: string;
};

type createMemberRequest = {
  path?: createMemberRequestPath;
  params?: createMemberRequestParams;
  body: createMemberRequestBody;
};
type createMemberResponse = IAuth;
/**수정 */
type updateMemberRequestPath = { id: string };
type updateMemberRequestBody = { password: string; name: string };

type updateMemberRequest = {
  path: updateMemberRequestPath;
  params?: {};
  body: updateMemberRequestBody;
};
type updateMemberResponse = IAuth;

/**삭제 */
type deleteMemberRequestPath = { id: string };

type deleteMemberRequest = {
  path: deleteMemberRequestPath;
  params?: {};
  body?: {};
};
type deleteMemberResponse = true;
