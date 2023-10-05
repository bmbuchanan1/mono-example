import styles from "./avatar.module.css";

const IMAGE_SIZE = 48;

interface Props {
  picture: string;
  name: string;
}

export function Avatar({ picture, name }: Props) {
  return (
    <div className={styles.avatar} data-tooltip={name}>
      <img
        src={picture}
        height={IMAGE_SIZE}
        width={IMAGE_SIZE}
        className={styles.avatar_picture}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}