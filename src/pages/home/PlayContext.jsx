import { useNavigate, useHref } from "react-router-dom";

const PlayContext = () => {
    const navigate = useNavigate();

    const currentLocation = useHref();

    const handleNavigate = () => {
        if (
            localStorage.getItem(
                "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
            )
        ) {
            return navigate("/play-my-contest");
        }
        navigate("/login", { state: currentLocation });
    };

    return (
        <div className="lg:w-screen w-[98%] m-auto flex items-center lg:flex-row flex-col justify-between lg:px-10  bg-[url('/assets/images/backgame.png')] bg-no-repeat px-4 bg-center bg-cover rounded-[50px] pb-10">
            <img src="/assets/images/game.png" alt="" />
            <div className="flex w-screen lg:w-[60vw] items-center justify-start flex-col gap-y-5 lg:gap-y-20">
                <div className="flex flex-col gap-y-4 items-center">
                    <h1 className="lg:text-6xl md:text-5xl text-xl text-white play_font">
                        PLAY THE CONTEST
                    </h1>
                    <h2 className="lg:text-2xl md:text-xl text-md text-white play_sub_font">
                        To enter the scratch code
                    </h2>
                </div>
                <div
                    onClick={handleNavigate}
                    className=" center_div bg-gradient-to-r from-yellow_color to-[#c8baa2] lg:px-6  p-2 lg:py-4   rounded-2xl text-[#E4E4E4] font-bold cursor-pointer text-sm lg:text-2xl"
                >
                    {localStorage.getItem(
                        "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
                    )
                        ? ""
                        : "LOG IN TO"}
                    PLAY CONTEST
                </div>
            </div>
        </div>
    );
};

export default PlayContext;
