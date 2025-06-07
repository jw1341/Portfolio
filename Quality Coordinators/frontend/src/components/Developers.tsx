import React, { useState } from "react";
import DecryptedText from "./DecryptedText";

interface Props {
  name: string;
  profile: string;
  linkedin: string;
  border?: boolean;
}

const Member = ({ name, profile, linkedin, border = true }: Props) => {
  const [ishover, sethover] = useState(false);
  return (
    <div
      className={`w-[220px] flex justify-between items-center ${
        border && "border-b border-[#585858]"
      } p-3 gap-10`}
    >
      <button
        onMouseEnter={() => {
          sethover(true);
        }}
        onMouseLeave={() => {
          sethover(false);
        }}
        className="flex items-center gap-2"
      >
        <img className="w-[40px] h-[40px] rounded-full" src={profile}></img>
        {ishover ? (
          <a className="flex gap-2 items-center" href={linkedin}>
            <DecryptedText
              revealDirection="center"
              animateOn="view"
              text="LinkedIn"
              speed={40}
              maxIterations={10}
              useOriginalCharsOnly={true}
              characters="AIR QUALITY CHECKER "
              parentClassName="text-white text-[16px]"
            />
            <i className="fa-solid fa-up-right-from-square"></i>
          </a>
        ) : (
          <p>{name}</p>
        )}
      </button>
    </div>
  );
};

const Developers = () => {
  const [ishover, sethover] = useState(false);
  return (
    <div
      onMouseEnter={() => sethover(true)}
      onMouseLeave={() => sethover(false)}
      className="overflow-visible flex flex-col"
    >
      <p className="cursor-pointer">Developers</p>
      <div
        className={`${
          ishover ? "opacity-100" : "opacity-0 translate-x-100"
        } transition-all duration-300 z-50 flex flex-col py-5 w-fit justify-start items-start absolute right-0 top-40`}
      >
        <div className="rounded-l-lg bg-[rgba(0,0,0,0.3)]">
          <Member
            name="Junheng Zheng"
            profile="https://media.licdn.com/dms/image/v2/D4E03AQEQA8VChkxQuw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1722657596295?e=1747872000&v=beta&t=X43UTileHPXrkl4jY_n6tU6VYYOkyC-xe93yBo-POZ4"
            linkedin="#"
          />
          <Member
            name="Jason Chen"
            profile="https://media.licdn.com/dms/image/v2/D4D03AQFg-XHnjqjqUA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1721227880026?e=1747872000&v=beta&t=hJjMBgpZ9T1QtSuW7BkXSXxvgecxTKVDCu6zDsAt1mo"
            linkedin="#"
          />
          <Member
            name="Ivan Li"
            profile="https://ih0.redbubble.net/image.1046392278.3346/raf,360x360,075,t,fafafa:ca443f4786.jpg"
            linkedin="#"
          />
          <Member
            name="Anderson Cardenas"
            profile="https://media.licdn.com/dms/image/v2/D4E03AQFo_ukiwuYQ6w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720548795929?e=1747872000&v=beta&t=z2_ne_PRZbrZM47zcsI9oBTzOOK-SVYnW2TKtjqEt60"
            linkedin="#"
          />
          <Member
            name="Jason Wu"
            profile="https://media.licdn.com/dms/image/v2/D5603AQEU1hl_sAZjcQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1722014371809?e=1747872000&v=beta&t=nUrAmNYlvEjiCCTC9EOB0as8DWd3hdw5xfguyLFOBC0"
            linkedin="#"
          />
          <Member
            name="Logan Shaw"
            profile="https://media.licdn.com/dms/image/v2/D4D03AQETk1RcQjP69g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1718267496040?e=1747872000&v=beta&t=Xws6gYbh4fGe8_ZHBaiL66YwohY0R7QSYaIMHP0C3h0"
            linkedin="#"
            border={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Developers;
